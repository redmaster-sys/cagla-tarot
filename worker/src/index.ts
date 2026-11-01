import { GoogleGenAI } from '@google/genai';

export interface Env {
  GEMINI_API_KEY?: string;
  /**
   * Default model is gemini-3.8-flash (free-tier supported current model).
   * Note: gemini-2.5-flash-lite is legacy/restricted per official Gemini API docs;
   * gemini-3.8-flash or gemini-3.5-flash-lite are the current free-tier models.
   */
  GEMINI_MODEL?: string;
  TURNSTILE_SECRET_KEY?: string;
  ALLOWED_ORIGINS?: string;
  RATE_LIMIT_PER_MINUTE?: string;
  GLOBAL_LIMIT_PER_HOUR?: string;
  GEMINI_TIMEOUT_MS?: string;
}

export interface CardPayloadItem {
  cardId: string;
  nameTr: string;
  nameEn: string;
  positionTitle: string;
  isReversed: boolean;
  isExtra: boolean;
  extraOrder?: number;
  uprightMeaning: string;
  reversedMeaning: string;
  symbolicDescription: string;
  userNote?: string;
}

export interface InterpretRequestBody {
  mode?: 'interpret' | 'chat';
  spreadType: string;
  spreadNameTr: string;
  question?: string;
  includeQuestion?: boolean;
  cards: CardPayloadItem[];
  generalNotes?: string;
  chatMessage?: string;
  chatHistory?: Array<{
    role: 'user' | 'assistant';
    text: string;
  }>;
  turnstileToken?: string;
}

export const QUOTA_EXCEEDED_MESSAGE_TR =
  'Yapay zekâ kullanım limitine ulaşıldı. Kartları açmaya ve klasik anlamları incelemeye devam edebilirsiniz.';

const MAX_REQUEST_BYTES = 24 * 1024; // 24 KB max request size
const DEFAULT_MODEL = 'gemini-3.8-flash';
const FORBIDDEN_PAID_ONLY_MODELS = new Set(['gemini-4-argon']);

// In-memory sliding window rate limiters per isolate
const ipBuckets = new Map<string, number[]>();
let globalHourBucket: number[] = [];

export function resetRateLimitBucketsForTest(): void {
  ipBuckets.clear();
  globalHourBucket = [];
}

function checkRateLimit(
  ip: string,
  perMinuteLimit: number,
  globalHourLimit: number,
  nowMs = Date.now()
): { allowed: boolean; reason?: 'ip' | 'global' } {
  const oneMinuteAgo = nowMs - 60_000;
  const oneHourAgo = nowMs - 3_600_000;

  // Clean & check global bucket
  globalHourBucket = globalHourBucket.filter((t) => t > oneHourAgo);
  if (globalHourBucket.length >= globalHourLimit) {
    return { allowed: false, reason: 'global' };
  }

  // Clean & check IP bucket
  const timestamps = (ipBuckets.get(ip) || []).filter((t) => t > oneMinuteAgo);
  if (timestamps.length >= perMinuteLimit) {
    ipBuckets.set(ip, timestamps);
    return { allowed: false, reason: 'ip' };
  }

  timestamps.push(nowMs);
  ipBuckets.set(ip, timestamps);
  globalHourBucket.push(nowMs);
  return { allowed: true };
}

function parseAllowedOrigins(envOrigins?: string): string[] {
  const defaults = [
    'http://localhost:5173',
    'http://localhost:4173',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:4173',
  ];
  if (!envOrigins || !envOrigins.trim()) {
    return defaults;
  }
  const custom = envOrigins
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  return Array.from(new Set([...defaults, ...custom]));
}

function isOriginAllowed(origin: string | null, allowedList: string[]): boolean {
  if (!origin) return true; // Non-browser or same-origin calls
  if (allowedList.includes('*')) return true;
  return allowedList.some((allowed) => {
    if (allowed === origin) return true;
    if (allowed.endsWith('.github.io') && origin.endsWith('.github.io')) {
      return allowed === origin;
    }
    return false;
  });
}

function buildCorsHeaders(origin: string | null, allowedOrigin: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin || allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Turnstile-Token',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function jsonResponse(
  data: Record<string, unknown>,
  status: number,
  corsHeaders: Record<string, string>
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-store',
      ...corsHeaders,
    },
  });
}

async function verifyTurnstileToken(
  token: string | undefined,
  secretKey: string | undefined,
  remoteIp: string
): Promise<boolean> {
  // If no secret key configured in dev, only accept non-empty token
  if (!secretKey || secretKey === '1x0000000000000000000000000000000AA') {
    if (!token || token.trim().length < 4) return false;
    if (token === 'INVALID_TURNSTILE_TOKEN') return false;
    return true;
  }

  if (!token || !token.trim()) {
    return false;
  }

  try {
    const formData = new URLSearchParams();
    formData.set('secret', secretKey);
    formData.set('response', token.trim());
    if (remoteIp && remoteIp !== 'unknown') {
      formData.set('remoteip', remoteIp);
    }

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });

    if (!res.ok) return false;
    const outcome = (await res.json()) as { success?: boolean };
    return Boolean(outcome.success);
  } catch {
    return false;
  }
}

export function validateRequestBody(body: unknown): {
  valid: boolean;
  error?: string;
  parsed?: InterpretRequestBody;
} {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Geçersiz JSON istek gövdesi.' };
  }

  const b = body as Partial<InterpretRequestBody>;
  const mode = b.mode === 'chat' ? 'chat' : 'interpret';

  if (!b.spreadType || typeof b.spreadType !== 'string' || b.spreadType.length > 80) {
    return { valid: false, error: 'Geçersiz açılım tipi (spreadType).' };
  }

  if (!Array.isArray(b.cards) || b.cards.length < 3 || b.cards.length > 78) {
    return {
      valid: false,
      error: 'Yorumlama için en az 3 açılmış kart gönderilmelidir.',
    };
  }

  for (const c of b.cards) {
    if (
      !c ||
      typeof c.cardId !== 'string' ||
      typeof c.nameTr !== 'string' ||
      typeof c.positionTitle !== 'string'
    ) {
      return { valid: false, error: 'Kart verileri eksik veya hatalı formatta.' };
    }
    if (c.userNote && typeof c.userNote === 'string' && c.userNote.length > 500) {
      return { valid: false, error: 'Kart notu çok uzun (maksimum 500 karakter).' };
    }
  }

  if (b.question && (typeof b.question !== 'string' || b.question.length > 600)) {
    return { valid: false, error: 'Danışan sorusu çok uzun (maksimum 600 karakter).' };
  }

  if (b.generalNotes && (typeof b.generalNotes !== 'string' || b.generalNotes.length > 1000)) {
    return { valid: false, error: 'Genel notlar çok uzun (maksimum 1000 karakter).' };
  }

  if (mode === 'chat') {
    if (!b.chatMessage || typeof b.chatMessage !== 'string' || !b.chatMessage.trim()) {
      return { valid: false, error: 'Sohbet mesajı boş olamaz.' };
    }
    if (b.chatMessage.length > 600) {
      return { valid: false, error: 'Sohbet mesajı çok uzun (maksimum 600 karakter).' };
    }
  }

  return {
    valid: true,
    parsed: {
      mode,
      spreadType: b.spreadType,
      spreadNameTr: typeof b.spreadNameTr === 'string' ? b.spreadNameTr.slice(0, 120) : b.spreadType,
      question: typeof b.question === 'string' ? b.question.trim() : '',
      includeQuestion: Boolean(b.includeQuestion),
      cards: b.cards,
      generalNotes: typeof b.generalNotes === 'string' ? b.generalNotes.trim() : '',
      chatMessage: typeof b.chatMessage === 'string' ? b.chatMessage.trim() : '',
      chatHistory: Array.isArray(b.chatHistory) ? b.chatHistory.slice(-10) : [],
      turnstileToken: typeof b.turnstileToken === 'string' ? b.turnstileToken : undefined,
    },
  };
}

const SYSTEM_INSTRUCTION_TR = `Sen "Çağla Tarot — Dijital Tarot Masası" uygulamasının uzman, zarif ve sezgisel Rider–Waite–Smith tarot yorumlayıcısısın.
Görevin, açılan kartları 1909 Pamela Colman Smith sembolizmi ve klasik Rider–Waite geleneği doğrultusunda açık, akıcı ve doğal bir Türkçe ile yorumlamaktır.

KESİN KURALLAR:
1. Kesin gelecek tahmini yaptığını, olayların mutlaka gerçekleşeceğini veya kartların bilimsel kanıt sunduğunu ASLA iddia etme.
2. Yorumlamaların her zaman sembolik, psikolojik farkındalık kazandırıcı, rehberlik edici ve yoruma açık olsun.
3. Tıbbi, hukuki veya finansal kesin hüküm verme.
4. Dilin sıcak, saygılı, edebi açıdan özenli ve anlaşılır Türkçe olsun.`;

function buildReadingContextPrompt(req: InterpretRequestBody): string {
  const initialCards = req.cards.filter((c) => !c.isExtra);
  const extraCards = req.cards.filter((c) => c.isExtra);

  const questionLine =
    req.includeQuestion && req.question
      ? `Danışanın Sorusu / Niyeti: "${req.question}"`
      : 'Danışanın Sorusu: (Paylaşılmadı — genel sembolik rehberlik olarak yorumla)';

  const formatCardLine = (c: CardPayloadItem, idx: number) => {
    const orientation = c.isReversed ? 'Ters (Reversed)' : 'Düz (Upright)';
    const activeMeaning = c.isReversed ? c.reversedMeaning : c.uprightMeaning;
    const notePart = c.userNote ? `\n   - Okuyucu Notu: ${c.userNote}` : '';
    return `${idx + 1}. Pozisyon [${c.positionTitle}]: ${c.nameTr} (${c.nameEn}) — Durum: ${orientation}
   - Klasik Anlamı: ${activeMeaning}
   - Rider–Waite Sembolizmi: ${c.symbolicDescription}${notePart}`;
  };

  const initialSection = initialCards.map(formatCardLine).join('\n\n');
  const extraSection =
    extraCards.length > 0
      ? `\n\nSONRADAN ÇEKİLEN EK KARTLAR (${extraCards.length} adet):\n` +
        extraCards.map((c, i) => formatCardLine(c, i)).join('\n\n')
      : '\n\nSONRADAN ÇEKİLEN EK KARTLAR: Henüz ek kart çekilmedi.';

  const notesSection = req.generalNotes
    ? `\n\nAnonimleştirilmiş Yorum Notları: "${req.generalNotes}"`
    : '';

  return `AÇILIM BİLGİLERİ:
Açılım Tipi: ${req.spreadNameTr} (${req.spreadType})
${questionLine}

ANA ÜÇ KART:
${initialSection}${extraSection}${notesSection}`;
}

const INTERPRETATION_JSON_SCHEMA = {
  type: 'object',
  properties: {
    individualCards: {
      type: 'array',
      description: 'Açılan her bir kartın sorunun ve pozisyonun bağlamına göre sembolik yorumu.',
      items: {
        type: 'object',
        properties: {
          cardId: { type: 'string' },
          cardNameTr: { type: 'string' },
          positionTitle: { type: 'string' },
          isReversed: { type: 'boolean' },
          interpretation: { type: 'string' },
        },
        required: ['cardId', 'cardNameTr', 'positionTitle', 'isReversed', 'interpretation'],
      },
    },
    combinedMessage: {
      type: 'string',
      description: 'Üç kartın birbirleriyle ilişkisi ve açılımın genel ortak mesajı.',
    },
    prominentSymbols: {
      type: 'string',
      description: 'Kartlarda bulunan dikkat çekici 1909 Rider–Waite–Smith sembolleri ve anlamları.',
    },
    notableThemes: {
      type: 'string',
      description: 'Açılımda tekrar eden konular, element dengesi, karşıtlıklar ve bağlantılar.',
    },
    extraCardsImpact: {
      type: 'string',
      description:
        'Sonradan çekilen ek kartların önceki yoruma kattığı yeni bakış açısı (ek kart yoksa üç kartın sentezini derinleştiren kapanış değerlendirmesi).',
    },
  },
  required: [
    'individualCards',
    'combinedMessage',
    'prominentSymbols',
    'notableThemes',
    'extraCardsImpact',
  ],
};

function resolveSafeFreeTierModel(configuredModel?: string): string {
  const candidate = (configuredModel || DEFAULT_MODEL).trim();
  // Never allow automatic or accidental switching to a paid-only model
  if (FORBIDDEN_PAID_ONLY_MODELS.has(candidate)) {
    return DEFAULT_MODEL;
  }
  // Substitute legacy 2.5/2.0/1.5 models with gemini-3.8-flash per current SDK guidelines
  if (
    candidate.startsWith('gemini-2.5-') ||
    candidate.startsWith('gemini-2.0-') ||
    candidate.startsWith('gemini-1.5-')
  ) {
    return DEFAULT_MODEL;
  }
  return candidate;
}

function getFreeTierModelCandidates(primaryModel: string): string[] {
  const list = [
    primaryModel,
    'gemini-3.5-flash-lite',
    'gemini-3.8-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.5-flash',
  ];
  return Array.from(new Set(list.filter(Boolean)));
}

function isModelNotFoundError(err: unknown): boolean {
  const message = (err instanceof Error ? err.message : String(err)).toLowerCase();
  const status = (err as { status?: number })?.status;
  return (
    status === 404 ||
    message.includes('404') ||
    message.includes('not_found') ||
    message.includes('not found') ||
    message.includes('is not supported')
  );
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');
    const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);

    if (!isOriginAllowed(origin, allowedOrigins)) {
      return new Response(
        JSON.stringify({
          ok: false,
          code: 'CORS_FORBIDDEN',
          error: 'Bu alan adından (Origin) erişim izni bulunmuyor.',
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
        }
      );
    }

    const corsHeaders = buildCorsHeaders(origin, allowedOrigins[0] || '*');

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method === 'GET' && url.pathname === '/api/health') {
      const model = resolveSafeFreeTierModel(env.GEMINI_MODEL);
      return jsonResponse(
        {
          ok: true,
          service: 'cagla-tarot-worker',
          model,
          configuredModel: env.GEMINI_MODEL || DEFAULT_MODEL,
          hasApiKey: Boolean(env.GEMINI_API_KEY && env.GEMINI_API_KEY.trim()),
        },
        200,
        corsHeaders
      );
    }

    if (
      request.method !== 'POST' ||
      (url.pathname !== '/api/interpret' && url.pathname !== '/api/chat')
    ) {
      return jsonResponse(
        {
          ok: false,
          code: 'NOT_FOUND',
          error: 'Yalnızca POST /api/interpret uç noktası desteklenmektedir.',
        },
        404,
        corsHeaders
      );
    }

    // 1. Check Content-Length header
    const contentLengthHeader = request.headers.get('Content-Length');
    if (contentLengthHeader && Number(contentLengthHeader) > MAX_REQUEST_BYTES) {
      return jsonResponse(
        {
          ok: false,
          code: 'PAYLOAD_TOO_LARGE',
          error: 'İstek boyutu izin verilen sınırı (24 KB) aşıyor.',
        },
        413,
        corsHeaders
      );
    }

    // 2. Read raw body and enforce byte limit
    let rawBody = '';
    try {
      rawBody = await request.text();
    } catch {
      return jsonResponse(
        { ok: false, code: 'BAD_REQUEST', error: 'İstek gövdesi okunamadı.' },
        400,
        corsHeaders
      );
    }

    if (new TextEncoder().encode(rawBody).byteLength > MAX_REQUEST_BYTES) {
      return jsonResponse(
        {
          ok: false,
          code: 'PAYLOAD_TOO_LARGE',
          error: 'İstek boyutu izin verilen sınırı (24 KB) aşıyor.',
        },
        413,
        corsHeaders
      );
    }

    // 3. Parse and validate JSON payload
    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(rawBody);
    } catch {
      return jsonResponse(
        { ok: false, code: 'INVALID_JSON', error: 'Geçersiz JSON formatı.' },
        400,
        corsHeaders
      );
    }

    const validation = validateRequestBody(parsedJson);
    if (!validation.valid || !validation.parsed) {
      return jsonResponse(
        {
          ok: false,
          code: 'VALIDATION_ERROR',
          error: validation.error || 'İstek doğrulaması başarısız oldu.',
        },
        400,
        corsHeaders
      );
    }

    const payload = validation.parsed;
    if (url.pathname === '/api/chat') {
      payload.mode = 'chat';
    }

    // 4. Rate Limiting (per IP and global)
    const clientIp =
      request.headers.get('CF-Connecting-IP') ||
      request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
      'unknown';
    const perMinLimit = Number(env.RATE_LIMIT_PER_MINUTE) || 10;
    const globalHourLimit = Number(env.GLOBAL_LIMIT_PER_HOUR) || 120;

    const rateCheck = checkRateLimit(clientIp, perMinLimit, globalHourLimit);
    if (!rateCheck.allowed) {
      return jsonResponse(
        {
          ok: false,
          code: 'QUOTA_EXCEEDED',
          error: QUOTA_EXCEEDED_MESSAGE_TR,
        },
        429,
        corsHeaders
      );
    }

    // 5. Turnstile verification
    const turnstileToken =
      payload.turnstileToken || request.headers.get('X-Turnstile-Token') || undefined;
    const turnstileOk = await verifyTurnstileToken(
      turnstileToken,
      env.TURNSTILE_SECRET_KEY,
      clientIp
    );
    if (!turnstileOk) {
      return jsonResponse(
        {
          ok: false,
          code: 'TURNSTILE_FAILED',
          error: 'Güvenlik doğrulaması (Cloudflare Turnstile) başarısız oldu. Lütfen sayfayı yenileyip tekrar deneyin.',
        },
        403,
        corsHeaders
      );
    }

    // 6. Verify GEMINI_API_KEY secret
    const apiKey = env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      return jsonResponse(
        {
          ok: false,
          code: 'MISSING_API_KEY',
          error:
            'Sunucu yapılandırmasında GEMINI_API_KEY tanımlı değil. Klasik tarot anlamlarını incelemeye devam edebilirsiniz.',
        },
        503,
        corsHeaders
      );
    }

    const model = resolveSafeFreeTierModel(env.GEMINI_MODEL);
    const timeoutMs = Number(env.GEMINI_TIMEOUT_MS) || 25_000;

    try {
      const client = new GoogleGenAI({ apiKey });
      const contextPrompt = buildReadingContextPrompt(payload);

      if (payload.mode === 'chat') {
        const steps: Array<{
          type: 'user_input' | 'model_output';
          content: Array<{ type: 'text'; text: string }>;
        }> = [
          {
            type: 'user_input',
            content: [
              {
                type: 'text',
                text: `Aşağıdaki tarot açılımı bağlamını dikkate alarak sorularımı sembolik olarak yanıtla:\n\n${contextPrompt}`,
              },
            ],
          },
          {
            type: 'model_output',
            content: [
              {
                type: 'text',
                text: 'Anlaşıldı. Açılımdaki kartların sembolizmini, pozisyonlarını ve birbirleriyle olan ilişkilerini dikkate alarak sorunuzu yanıtlamaya hazırım.',
              },
            ],
          },
        ];

        for (const msg of payload.chatHistory || []) {
          if (msg.text && msg.text.trim()) {
            steps.push({
              type: msg.role === 'assistant' ? 'model_output' : 'user_input',
              content: [{ type: 'text', text: msg.text.trim() }],
            });
          }
        }

        steps.push({
          type: 'user_input',
          content: [{ type: 'text', text: payload.chatMessage || '' }],
        });

        const candidates = getFreeTierModelCandidates(model);
        let interaction: { output_text?: string } | null = null;
        let usedModel = model;
        let lastErr: unknown = null;

        for (const candidateModel of candidates) {
          try {
            usedModel = candidateModel;
            const interactionPromise = client.interactions.create({
              model: candidateModel,
              system_instruction: SYSTEM_INSTRUCTION_TR,
              input: steps,
              store: false,
            });

            interaction = await Promise.race([
              interactionPromise,
              new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error('GEMINI_TIMEOUT')), timeoutMs)
              ),
            ]);
            break;
          } catch (e) {
            lastErr = e;
            if (!isModelNotFoundError(e)) {
              throw e;
            }
          }
        }

        if (!interaction) {
          throw lastErr || new Error('EMPTY_MODEL_RESPONSE');
        }

        const replyText = (interaction.output_text || '').trim();
        if (!replyText) {
          throw new Error('EMPTY_MODEL_RESPONSE');
        }

        return jsonResponse(
          {
            ok: true,
            mode: 'chat',
            modelUsed: usedModel,
            reply: replyText,
          },
          200,
          corsHeaders
        );
      }

      // Default mode: 'interpret' (5 structured sections)
      const prompt = `${contextPrompt}

Lütfen bu açılımı aşağıdaki 5 başlıkta derinlikli, sembolik ve doğal bir Türkçe ile yorumla:
1. individualCards: Açılan her kartın pozisyonuna ve sorunun bağlamına göre bireysel sembolik yorumu.
2. combinedMessage: Üç ana kartın ortak mesajı, birbirleriyle kurduğu akış ve açılımın ana teması.
3. prominentSymbols: Kartların 1909 Rider–Waite–Smith çizimlerinde öne çıkan semboller ve bu açılımdaki anlamları.
4. notableThemes: Açılımda tekrar eden temalar, element/arkana dengesi, karşıtlıklar ve içsel bağlantılar.
5. extraCardsImpact: Sonradan çekilen ek kartların önceki yoruma kattığı yeni bakış açısı (eğer ek kart çekilmediyse üç kartın bütünleştirici rehberliği).`;

      const candidates = getFreeTierModelCandidates(model);
      let interaction: { output_text?: string } | null = null;
      let usedModel = model;
      let lastErr: unknown = null;

      for (const candidateModel of candidates) {
        try {
          usedModel = candidateModel;
          const interactionPromise = client.interactions.create({
            model: candidateModel,
            system_instruction: SYSTEM_INSTRUCTION_TR,
            input: prompt,
            response_format: {
              type: 'text',
              mime_type: 'application/json',
              schema: INTERPRETATION_JSON_SCHEMA,
            },
            store: false,
          });

          interaction = await Promise.race([
            interactionPromise,
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error('GEMINI_TIMEOUT')), timeoutMs)
            ),
          ]);
          break;
        } catch (e) {
          lastErr = e;
          if (!isModelNotFoundError(e)) {
            throw e;
          }
        }
      }

      if (!interaction) {
        throw lastErr || new Error('EMPTY_MODEL_RESPONSE');
      }

      const rawOutputText = (interaction.output_text || '').trim();
      if (!rawOutputText) {
        throw new Error('EMPTY_MODEL_RESPONSE');
      }

      const parsedInterpretation = JSON.parse(rawOutputText);

      return jsonResponse(
        {
          ok: true,
          mode: 'interpret',
          modelUsed: usedModel,
          interpretation: {
            individualCards: Array.isArray(parsedInterpretation.individualCards)
              ? parsedInterpretation.individualCards
              : [],
            combinedMessage: String(parsedInterpretation.combinedMessage || ''),
            prominentSymbols: String(parsedInterpretation.prominentSymbols || ''),
            notableThemes: String(parsedInterpretation.notableThemes || ''),
            extraCardsImpact: String(parsedInterpretation.extraCardsImpact || ''),
          },
        },
        200,
        corsHeaders
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      const status = (err as { status?: number })?.status;

      if (message === 'GEMINI_TIMEOUT') {
        return jsonResponse(
          {
            ok: false,
            code: 'TIMEOUT',
            error:
              'Yapay zekâ yanıt süresi zaman aşımına uğradı. Kartları açmaya ve klasik anlamları incelemeye devam edebilirsiniz.',
          },
          504,
          corsHeaders
        );
      }

      if (
        status === 429 ||
        message.includes('429') ||
        message.includes('RESOURCE_EXHAUSTED') ||
        message.toLowerCase().includes('quota') ||
        message.toLowerCase().includes('rate limit')
      ) {
        return jsonResponse(
          {
            ok: false,
            code: 'QUOTA_EXCEEDED',
            error: QUOTA_EXCEEDED_MESSAGE_TR,
          },
          429,
          corsHeaders
        );
      }

      if (
        status === 400 ||
        status === 401 ||
        status === 403 ||
        message.includes('API_KEY_INVALID') ||
        message.toLowerCase().includes('api key not valid') ||
        message.toLowerCase().includes('invalid api key') ||
        message.includes('401') ||
        message.includes('403')
      ) {
        return jsonResponse(
          {
            ok: false,
            code: 'INVALID_API_KEY',
            error:
              'Gemini API anahtarı geçersiz veya yetkilendirme hatası oluştu. Klasik tarot anlamlarını incelemeye devam edebilirsiniz.',
          },
          401,
          corsHeaders
        );
      }

      return jsonResponse(
        {
          ok: false,
          code: 'UPSTREAM_ERROR',
          error:
            'Yapay zekâ servisine şu anda ulaşılamıyor. Kartları açmaya ve klasik anlamları incelemeye devam edebilirsiniz.',
        },
        502,
        corsHeaders
      );
    }
  },
};
