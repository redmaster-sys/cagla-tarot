import {
  GeminiInterpretationResult,
  ReadingSession,
  SPREAD_DEFINITIONS,
} from '../types/tarot';
import { anonymizeTextForAi } from '../utils/storage';
import { computeReadingSignature } from '../utils/tarotEngine';

export const QUOTA_EXCEEDED_USER_MESSAGE =
  'Yapay zekâ kullanım limitine ulaşıldı. Kartları açmaya ve klasik anlamları incelemeye devam edebilirsiniz.';

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
    throw new GeminiServiceError(
      'Sunucu bağlantısı kurulamadı. Çevrimdışı modda kartları açmaya ve klasik anlamları incelemeye devam edebilirsiniz.',
      'NETWORK_ERROR',
      0
    );
  }

  let data: Record<string, unknown> = {};
  try {
    data = (await response.json()) as Record<string, unknown>;
  } catch {
    throw new GeminiServiceError(
      'Sunucudan geçersiz yanıt alındı. Klasik tarot anlamlarını incelemeye devam edebilirsiniz.',
      'INVALID_RESPONSE',
      response.status
    );
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
    throw new GeminiServiceError(
      'Sunucu bağlantısı kurulamadı. Çevrimdışı modda klasik kart anlamlarını inceleyebilirsiniz.',
      'NETWORK_ERROR',
      0
    );
  }

  let data: Record<string, unknown> = {};
  try {
    data = (await response.json()) as Record<string, unknown>;
  } catch {
    throw new GeminiServiceError(
      'Sunucudan geçersiz yanıt alındı.',
      'INVALID_RESPONSE',
      response.status
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
