import {
  GeminiInterpretationResult,
  ReadingSession,
  SPREAD_DEFINITIONS,
} from '../types/tarot';
import { anonymizeTextForAi } from '../utils/storage';
import { computeReadingSignature } from '../utils/tarotEngine';

export const QUOTA_EXCEEDED_USER_MESSAGE =
  'Yapay zekâ kullanım limitine ulaşıldı. Kartları açmaya ve klasik anlamları incelemeye devam edebilirsiniz.';

const DEVICE_API_KEY_STORAGE = 'cagla_tarot_device_api_key_v1';

export function extractCleanGeminiKey(rawInput: string): string {
  if (!rawInput || typeof rawInput !== 'string') return '';
  const match = rawInput.match(/AIza[0-9A-Za-z\-_]{20,80}/);
  if (match && match[0]) {
    return match[0].trim();
  }
  const cleaned = rawInput
    .replace(/^GEMINI_API_KEY\s*=\s*/im, '')
    .trim()
    .replace(/^['"]|['"]$/g, '');
  if (!cleaned || cleaned === 'BURAYA_API_ANAHTARINIZI_YAPISTIRIN' || cleaned.length < 15) {
    return '';
  }
  return cleaned;
}

export function getSavedDeviceApiKey(): string {
  try {
    const raw = localStorage.getItem(DEVICE_API_KEY_STORAGE) || '';
    return extractCleanGeminiKey(raw);
  } catch {
    return '';
  }
}

export function saveDeviceApiKey(rawInput: string): string {
  const clean = extractCleanGeminiKey(rawInput);
  if (!clean) return '';
  try {
    localStorage.setItem(DEVICE_API_KEY_STORAGE, clean);
  } catch {
    // Ignore storage quota errors
  }
  return clean;
}

export function clearDeviceApiKey(): void {
  try {
    localStorage.removeItem(DEVICE_API_KEY_STORAGE);
  } catch {
    // Ignore
  }
}

export class GeminiServiceError extends Error {
  public readonly code: string;
  public readonly status: number;

  constructor(message: string, code = 'UNKNOWN_ERROR', status = 500) {
    super(message);
    this.name = 'GeminiServiceError';
    this.code = code;
    this.status = status;
  }
}

function buildCardsPayload(session: ReadingSession) {
  const revealedInitial = session.initialCards.filter((c) => c.isRevealed);
  const revealedExtra = session.extraCards.filter((c) => c.isRevealed);

  return [
    ...revealedInitial.map((dc) => ({
      cardId: dc.cardId,
      nameTr: dc.card.nameTr,
      nameEn: dc.card.nameEn,
      positionTitle: dc.positionTitle,
      isReversed: dc.isReversed,
      isExtra: false,
      uprightMeaning: dc.card.uprightMeaning,
      reversedMeaning: dc.card.reversedMeaning,
      symbolicDescription: dc.card.symbolicDescription,
      userNote: anonymizeTextForAi(dc.userNote || ''),
    })),
    ...revealedExtra.map((dc, idx) => ({
      cardId: dc.cardId,
      nameTr: dc.card.nameTr,
      nameEn: dc.card.nameEn,
      positionTitle: dc.positionTitle,
      isReversed: dc.isReversed,
      isExtra: true,
      extraOrder: idx + 1,
      uprightMeaning: dc.card.uprightMeaning,
      reversedMeaning: dc.card.reversedMeaning,
      symbolicDescription: dc.card.symbolicDescription,
      userNote: anonymizeTextForAi(dc.userNote || ''),
    })),
  ];
}

const SYSTEM_INSTRUCTION_TR = `Sen "Çağla Tarot — Dijital Tarot Masası" uygulamasının uzman, zarif ve sezgisel Rider–Waite–Smith tarot yorumlayıcısısın.
Görevin, açılan kartları 1909 Pamela Colman Smith sembolizmi ve klasik Rider–Waite geleneği doğrultusunda açık, akıcı ve doğal bir Türkçe ile yorumlamaktır.

KESİN KURALLAR:
1. Kesin gelecek tahmini yaptığını, olayların mutlaka gerçekleşeceğini veya kartların bilimsel kanıt sunduğunu ASLA iddia etme.
2. Yorumlamaların her zaman sembolik, psikolojik farkındalık kazandırıcı, rehberlik edici ve yoruma açık olsun.
3. Tıbbi, hukuki veya finansal kesin hüküm verme.
4. Dilin sıcak, saygılı, edebi açıdan özenli ve anlaşılır Türkçe olsun.`;

function buildDirectContextPrompt(params: {
  spreadNameTr: string;
  spreadType: string;
  question: string;
  includeQuestion: boolean;
  cards: ReturnType<typeof buildCardsPayload>;
  generalNotes: string;
}): string {
  const initialCards = params.cards.filter((c) => !c.isExtra);
  const extraCards = params.cards.filter((c) => c.isExtra);

  const questionLine =
    params.includeQuestion && params.question
      ? `Danışanın Sorusu / Niyeti: "${params.question}"`
      : 'Danışanın Sorusu: (Paylaşılmadı — genel sembolik rehberlik olarak yorumla)';

  const formatCardLine = (c: (typeof params.cards)[number], idx: number) => {
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

  const notesSection = params.generalNotes
    ? `\n\nAnonimleştirilmiş Yorum Notları: "${params.generalNotes}"`
    : '';

  return `AÇILIM BİLGİLERİ:
Açılım Tipi: ${params.spreadNameTr} (${params.spreadType})
${questionLine}

ANA ÜÇ KART:
${initialSection}${extraSection}${notesSection}`;
}

const FREE_TIER_MODELS = [
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.8-flash',
  'gemini-2.0-flash',
];

async function callDirectGeminiWithFallback(
  apiKey: string,
  buildPayload: (model: string) => Record<string, unknown>
): Promise<{ text: string; modelUsed: string }> {
  let lastError: GeminiServiceError | null = null;

  for (const model of FREE_TIER_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
      apiKey
    )}`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload(model)),
      });

      const data = (await res.json()) as {
        candidates?: Array<{
          content?: { parts?: Array<{ text?: string }> };
        }>;
        error?: { code?: number; message?: string; status?: string };
      };

      if (res.status === 429 || data.error?.status === 'RESOURCE_EXHAUSTED') {
        throw new GeminiServiceError(QUOTA_EXCEEDED_USER_MESSAGE, 'QUOTA_EXCEEDED', 429);
      }

      if (
        res.status === 400 &&
        (data.error?.message?.includes('API_KEY_INVALID') ||
          data.error?.message?.toLowerCase().includes('api key not valid'))
      ) {
        throw new GeminiServiceError(
          'Girilen Gemini API anahtarı geçersiz. Lütfen AIza... ile başlayan anahtarınızı kontrol edin.',
          'INVALID_API_KEY',
          401
        );
      }

      if (res.status === 404 || data.error?.status === 'NOT_FOUND') {
        lastError = new GeminiServiceError('Model bulunamadı', 'MODEL_NOT_FOUND', 404);
        continue;
      }

      if (!res.ok) {
        lastError = new GeminiServiceError(
          data.error?.message || 'Gemini API isteği başarısız oldu.',
          'API_ERROR',
          res.status
        );
        continue;
      }

      const text =
        data.candidates?.[0]?.content?.parts
          ?.map((p) => p.text || '')
          .join('')
          .trim() || '';

      if (text) {
        return { text, modelUsed: model };
      }
    } catch (err) {
      if (err instanceof GeminiServiceError && (err.code === 'QUOTA_EXCEEDED' || err.code === 'INVALID_API_KEY')) {
        throw err;
      }
      lastError =
        err instanceof GeminiServiceError
          ? err
          : new GeminiServiceError('Ağ bağlantısı kurulamadı.', 'NETWORK_ERROR', 0);
    }
  }

  throw (
    lastError ||
    new GeminiServiceError(
      'Yapay zekâ servisine şu anda ulaşılamıyor. Klasik tarot anlamlarını incelemeye devam edebilirsiniz.',
      'API_ERROR',
      502
    )
  );
}

async function runDirectDeviceInterpretation(
  session: ReadingSession,
  deviceApiKey: string
): Promise<GeminiInterpretationResult> {
  const spreadDef =
    SPREAD_DEFINITIONS[session.spreadType] || SPREAD_DEFINITIONS['past-present-future'];
  const cards = buildCardsPayload(session);
  const contextPrompt = buildDirectContextPrompt({
    spreadNameTr: spreadDef.nameTr,
    spreadType: session.spreadType,
    question: session.includeQuestionInAi ? anonymizeTextForAi(session.question) : '',
    includeQuestion: session.includeQuestionInAi,
    cards,
    generalNotes: anonymizeTextForAi(session.generalNotes),
  });

  const prompt = `${contextPrompt}

Lütfen bu açılımı aşağıdaki 5 başlıkta derinlikli, sembolik ve doğal bir Türkçe ile JSON formatında yorumla:
1. individualCards: Açılan her kartın pozisyonuna ve sorunun bağlamına göre bireysel sembolik yorumu ({ cardId, cardNameTr, positionTitle, isReversed, interpretation } dizisi).
2. combinedMessage: Üç ana kartın ortak mesajı, birbirleriyle kurduğu akış ve açılımın ana teması.
3. prominentSymbols: Kartların 1909 Rider–Waite–Smith çizimlerinde öne çıkan semboller ve bu açılımdaki anlamları.
4. notableThemes: Açılımda tekrar eden temalar, element/arkana dengesi, karşıtlıklar ve içsel bağlantılar.
5. extraCardsImpact: Sonradan çekilen ek kartların önceki yoruma kattığı yeni bakış açısı (eğer ek kart çekilmediyse üç kartın bütünleştirici rehberliği).`;

  const { text, modelUsed } = await callDirectGeminiWithFallback(deviceApiKey, () => ({
    systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION_TR }] },
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          individualCards: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                cardId: { type: 'STRING' },
                cardNameTr: { type: 'STRING' },
                positionTitle: { type: 'STRING' },
                isReversed: { type: 'BOOLEAN' },
                interpretation: { type: 'STRING' },
              },
              required: ['cardId', 'cardNameTr', 'positionTitle', 'isReversed', 'interpretation'],
            },
          },
          combinedMessage: { type: 'STRING' },
          prominentSymbols: { type: 'STRING' },
          notableThemes: { type: 'STRING' },
          extraCardsImpact: { type: 'STRING' },
        },
        required: [
          'individualCards',
          'combinedMessage',
          'prominentSymbols',
          'notableThemes',
          'extraCardsImpact',
        ],
      },
    },
  }));

  const parsed = JSON.parse(text) as Partial<GeminiInterpretationResult>;
  return {
    individualCards: Array.isArray(parsed.individualCards) ? parsed.individualCards : [],
    combinedMessage: String(parsed.combinedMessage || ''),
    prominentSymbols: String(parsed.prominentSymbols || ''),
    notableThemes: String(parsed.notableThemes || ''),
    extraCardsImpact: String(parsed.extraCardsImpact || ''),
    modelUsed,
    generatedAt: new Date().toISOString(),
    signatureKey: computeReadingSignature(session),
  };
}

async function runDirectDeviceChat(
  session: ReadingSession,
  chatMessage: string,
  deviceApiKey: string
): Promise<{ reply: string; modelUsed: string }> {
  const spreadDef =
    SPREAD_DEFINITIONS[session.spreadType] || SPREAD_DEFINITIONS['past-present-future'];
  const cards = buildCardsPayload(session);
  const contextPrompt = buildDirectContextPrompt({
    spreadNameTr: spreadDef.nameTr,
    spreadType: session.spreadType,
    question: session.includeQuestionInAi ? anonymizeTextForAi(session.question) : '',
    includeQuestion: session.includeQuestionInAi,
    cards,
    generalNotes: anonymizeTextForAi(session.generalNotes),
  });

  const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [
    {
      role: 'user',
      parts: [
        {
          text: `Aşağıdaki tarot açılımı bağlamını dikkate alarak sorularımı sembolik olarak yanıtla:\n\n${contextPrompt}`,
        },
      ],
    },
    {
      role: 'model',
      parts: [
        {
          text: 'Anlaşıldı. Açılımdaki kartların sembolizmini, pozisyonlarını ve birbirleriyle olan ilişkilerini dikkate alarak sorunuzu yanıtlamaya hazırım.',
        },
      ],
    },
  ];

  for (const msg of session.chatHistory.slice(-10)) {
    if (msg.text && msg.text.trim()) {
      contents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.text.trim() }],
      });
    }
  }

  contents.push({
    role: 'user',
    parts: [{ text: anonymizeTextForAi(chatMessage) }],
  });

  const { text, modelUsed } = await callDirectGeminiWithFallback(deviceApiKey, () => ({
    systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION_TR }] },
    contents,
  }));

  return { reply: text, modelUsed };
}

export async function requestGeminiInterpretation(params: {
  session: ReadingSession;
  workerApiUrl: string;
  turnstileToken: string;
}): Promise<GeminiInterpretationResult> {
  const { session, workerApiUrl, turnstileToken } = params;

  if (session.initialCards.length < 3 || session.initialCards.some((c) => !c.isRevealed)) {
    throw new GeminiServiceError(
      'Yapay zekâ yorumu için önce masadaki ilk üç kartın tamamını açmalısınız.',
      'CARDS_NOT_REVEALED',
      400
    );
  }

  const spreadDef =
    SPREAD_DEFINITIONS[session.spreadType] || SPREAD_DEFINITIONS['past-present-future'];

  const requestBody = {
    mode: 'interpret' as const,
    spreadType: session.spreadType,
    spreadNameTr: spreadDef.nameTr,
    question: session.includeQuestionInAi ? anonymizeTextForAi(session.question) : '',
    includeQuestion: session.includeQuestionInAi,
    cards: buildCardsPayload(session),
    generalNotes: anonymizeTextForAi(session.generalNotes),
    turnstileToken: turnstileToken || 'dev-turnstile-token',
  };

  const deviceKey = getSavedDeviceApiKey();

  let response: Response;
  try {
    response = await fetch(workerApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Turnstile-Token': requestBody.turnstileToken,
      },
      body: JSON.stringify(requestBody),
    });
  } catch {
    if (deviceKey) {
      return runDirectDeviceInterpretation(session, deviceKey);
    }
    throw new GeminiServiceError(
      'Sunucu bağlantısı kurulamadı. Çevrimdışı modda kartları açmaya ve klasik anlamları incelemeye devam edebilirsiniz.',
      'NETWORK_ERROR',
      0
    );
  }

  let data: Record<string, unknown> = {};
  let jsonParseFailed = false;
  try {
    data = (await response.json()) as Record<string, unknown>;
  } catch {
    jsonParseFailed = true;
  }

  // Static hosting (GitHub Pages returns 404 HTML for /api/interpret) or unconfigured local worker
  if (
    response.status === 404 ||
    response.status === 405 ||
    response.status === 503 ||
    data.code === 'MISSING_API_KEY' ||
    jsonParseFailed
  ) {
    if (deviceKey) {
      return runDirectDeviceInterpretation(session, deviceKey);
    }
    if (response.status === 404 || response.status === 405 || jsonParseFailed) {
      throw new GeminiServiceError(
        'Mobil / GitHub Pages üzerinde Gemini yorumlarını kullanmak için aşağıdaki kutuya Gemini API anahtarınızı (AIza...) bir kez yapıştırıp kaydedin.',
        'MISSING_API_KEY',
        503
      );
    }
  }

  if (response.status === 429 || data.code === 'QUOTA_EXCEEDED') {
    throw new GeminiServiceError(QUOTA_EXCEEDED_USER_MESSAGE, 'QUOTA_EXCEEDED', 429);
  }

  if (response.status === 401 || response.status === 403 || data.code === 'INVALID_API_KEY') {
    throw new GeminiServiceError(
      typeof data.error === 'string'
        ? data.error
        : 'Gemini API anahtarı doğrulanamadı veya geçersiz. Klasik tarot anlamlarını incelemeye devam edebilirsiniz.',
      String(data.code || 'INVALID_API_KEY'),
      response.status
    );
  }

  if (!response.ok || !data.ok || !data.interpretation) {
    throw new GeminiServiceError(
      typeof data.error === 'string'
        ? data.error
        : 'Yapay zekâ yorumu alınırken bir sorun oluştu. Klasik tarot anlamlarını incelemeye devam edebilirsiniz.',
      String(data.code || 'API_ERROR'),
      response.status
    );
  }

  const rawInterp = data.interpretation as {
    individualCards?: GeminiInterpretationResult['individualCards'];
    combinedMessage?: string;
    prominentSymbols?: string;
    notableThemes?: string;
    extraCardsImpact?: string;
  };

  return {
    individualCards: Array.isArray(rawInterp.individualCards) ? rawInterp.individualCards : [],
    combinedMessage: String(rawInterp.combinedMessage || ''),
    prominentSymbols: String(rawInterp.prominentSymbols || ''),
    notableThemes: String(rawInterp.notableThemes || ''),
    extraCardsImpact: String(rawInterp.extraCardsImpact || ''),
    modelUsed: typeof data.modelUsed === 'string' ? data.modelUsed : 'gemini-3.8-flash',
    generatedAt: new Date().toISOString(),
    signatureKey: computeReadingSignature(session),
  };
}

export async function requestGeminiFollowUpChat(params: {
  session: ReadingSession;
  chatMessage: string;
  workerApiUrl: string;
  turnstileToken: string;
}): Promise<{ reply: string; modelUsed: string }> {
  const { session, chatMessage, workerApiUrl, turnstileToken } = params;

  const spreadDef =
    SPREAD_DEFINITIONS[session.spreadType] || SPREAD_DEFINITIONS['past-present-future'];

  const requestBody = {
    mode: 'chat' as const,
    spreadType: session.spreadType,
    spreadNameTr: spreadDef.nameTr,
    question: session.includeQuestionInAi ? anonymizeTextForAi(session.question) : '',
    includeQuestion: session.includeQuestionInAi,
    cards: buildCardsPayload(session),
    generalNotes: anonymizeTextForAi(session.generalNotes),
    chatMessage: anonymizeTextForAi(chatMessage),
    chatHistory: session.chatHistory.slice(-10).map((m) => ({
      role: m.role,
      text: m.text,
    })),
    turnstileToken: turnstileToken || 'dev-turnstile-token',
  };

  const deviceKey = getSavedDeviceApiKey();

  let response: Response;
  try {
    response = await fetch(workerApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Turnstile-Token': requestBody.turnstileToken,
      },
      body: JSON.stringify(requestBody),
    });
  } catch {
    if (deviceKey) {
      return runDirectDeviceChat(session, chatMessage, deviceKey);
    }
    throw new GeminiServiceError(
      'Sunucu bağlantısı kurulamadı. Çevrimdışı modda klasik kart anlamlarını inceleyebilirsiniz.',
      'NETWORK_ERROR',
      0
    );
  }

  let data: Record<string, unknown> = {};
  let jsonParseFailed = false;
  try {
    data = (await response.json()) as Record<string, unknown>;
  } catch {
    jsonParseFailed = true;
  }

  if (
    response.status === 404 ||
    response.status === 405 ||
    response.status === 503 ||
    data.code === 'MISSING_API_KEY' ||
    jsonParseFailed
  ) {
    if (deviceKey) {
      return runDirectDeviceChat(session, chatMessage, deviceKey);
    }
    throw new GeminiServiceError(
      'Sohbet için önce Gemini API anahtarınızı kaydedin.',
      'MISSING_API_KEY',
      503
    );
  }

  if (response.status === 429 || data.code === 'QUOTA_EXCEEDED') {
    throw new GeminiServiceError(QUOTA_EXCEEDED_USER_MESSAGE, 'QUOTA_EXCEEDED', 429);
  }

  if (!response.ok || !data.ok || typeof data.reply !== 'string') {
    throw new GeminiServiceError(
      typeof data.error === 'string'
        ? data.error
        : 'Sohbet yanıtı alınamadı. Klasik tarot anlamlarını incelemeye devam edebilirsiniz.',
      String(data.code || 'CHAT_ERROR'),
      response.status
    );
  }

  return {
    reply: data.reply,
    modelUsed: typeof data.modelUsed === 'string' ? data.modelUsed : 'gemini-3.8-flash',
  };
}

/**
 * Generates a structured classical Rider–Waite–Smith synthesis locally without any network dependency.
 * Used when the user is offline, has no API key, or when AI quota is reached.
 */
export function buildClassicalFallbackSynthesis(
  session: ReadingSession
): GeminiInterpretationResult {
  const revealedInitial = session.initialCards.filter((c) => c.isRevealed);
  const revealedExtra = session.extraCards.filter((c) => c.isRevealed);
  const allRevealed = [...revealedInitial, ...revealedExtra];

  const individualCards = allRevealed.map((dc) => ({
    cardId: dc.cardId,
    cardNameTr: dc.card.nameTr,
    positionTitle: dc.positionTitle,
    isReversed: dc.isReversed,
    interpretation: `${dc.positionTitle} konumundaki ${dc.card.nameTr} (${
      dc.isReversed ? 'Ters' : 'Düz'
    }): ${dc.isReversed ? dc.card.reversedMeaning : dc.card.uprightMeaning}${
      dc.userNote ? ` — Okuyucu Notu: "${dc.userNote}"` : ''
    }`,
  }));

  const majorCount = allRevealed.filter((c) => c.card.arcana === 'major').length;
  const reversedCount = allRevealed.filter((c) => c.isReversed).length;

  const combinedMessage =
    revealedInitial.length === 3
      ? `${revealedInitial[0].positionTitle} noktasında ${revealedInitial[0].card.nameTr} ile başlayan süreç, ${revealedInitial[1].positionTitle} aşamasında ${revealedInitial[1].card.nameTr} enerjisiyle şekillenmekte ve ${revealedInitial[2].positionTitle} odağında ${revealedInitial[2].card.nameTr} sembolizmine doğru evrilmektedir. Klasik Rider–Waite–Smith geleneğinde bu üçlü dizilim; geçmiş deneyimin bugünkü farkındalığı beslediğini ve bilinçli seçimlerle yeni bir denge kurulduğunu hatırlatır.`
      : 'Kartların tamamı açıldığında klasik üçlü sentez burada görüntülenir.';

  const prominentSymbols = allRevealed
    .map((dc) => `• ${dc.card.nameTr}: ${dc.card.symbolicDescription}`)
    .join('\n\n');

  const allKeywords = Array.from(
    new Set(allRevealed.flatMap((dc) => dc.card.keywords))
  ).slice(0, 10);

  const notableThemes = `Açılımda ${allRevealed.length} kart içinde ${majorCount} Büyük Arkana ve ${reversedCount} ters konumda kart yer almaktadır. Öne çıkan sembolik anahtar temalar: ${allKeywords.join(
    ', '
  )}. ${
    majorCount >= 2
      ? 'Büyük Arkana kartlarının yoğunluğu, gündelik olayların ötesinde derin bir yaşam dersi ve içsel dönüşüm sürecine işaret eder.'
      : 'Küçük Arkana kartlarının ağırlığı, sürecin günlük adımlar, pratik seçimler ve kişilerarası iletişimle doğrudan yönetilebileceğini gösterir.'
  }`;

  const extraCardsImpact =
    revealedExtra.length > 0
      ? revealedExtra
          .map(
            (dc) =>
              `${dc.positionTitle} (${dc.card.nameTr} - ${
                dc.isReversed ? 'Ters' : 'Düz'
              }): ${dc.isReversed ? dc.card.reversedMeaning : dc.card.uprightMeaning}`
          )
          .join('\n\n')
      : 'Bu oturumda henüz açılmış bir ek kart bulunmuyor. Dilerseniz Tarot Masası ekranından "Bir Kart Daha Çek" butonuyla açılımı derinleştirebilirsiniz.';

  return {
    individualCards,
    combinedMessage,
    prominentSymbols,
    notableThemes,
    extraCardsImpact,
    modelUsed: 'Klasik Rider–Waite–Smith Rehberi (Yerel)',
    generatedAt: new Date().toISOString(),
    signatureKey: computeReadingSignature(session),
  };
}
