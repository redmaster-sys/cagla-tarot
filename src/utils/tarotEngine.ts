import { TAROT_DECK, getCardById } from '../data/tarotDeck';
import {
  DrawnCard,
  ReadingSession,
  SpreadType,
  SPREAD_DEFINITIONS,
} from '../types/tarot';

/**
 * Generates an unbiased cryptographically secure random integer in [0, maxExclusive).
 * Uses rejection sampling over crypto.getRandomValues(Uint32Array) to eliminate modulo bias.
 */
export function cryptoRandomInt(maxExclusive: number): number {
  if (maxExclusive <= 1) return 0;
  const maxUint32 = 0xffffffff;
  const limit = maxUint32 - ((maxUint32 + 1) % maxExclusive);
  const buffer = new Uint32Array(1);

  while (true) {
    crypto.getRandomValues(buffer);
    const val = buffer[0];
    if (val < limit) {
      return val % maxExclusive;
    }
  }
}

/**
 * Cryptographically secure boolean with 50/50 probability.
 */
export function cryptoRandomBoolean(): boolean {
  return cryptoRandomInt(2) === 1;
}

/**
 * Unbiased Fisher–Yates shuffle using CSPRNG.
 * Returns a new shuffled array without mutating the input.
 */
export function cryptoFisherYatesShuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = cryptoRandomInt(i + 1);
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

/**
 * Generates a unique session or instance ID using CSPRNG.
 */
export function generateId(prefix = 'tr'): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${prefix}-${Date.now()}-${hex}`;
}

/**
 * Creates a fresh reading session in idle state with all 78 cards ready.
 */
export function createInitialSession(
  spreadType: SpreadType = 'past-present-future',
  allowReversed = true,
  includeQuestionInAi = false
): ReadingSession {
  const now = new Date().toISOString();
  const allIds = TAROT_DECK.map((c) => c.id);
  const reversedMap: Record<string, boolean> = {};
  for (const id of allIds) {
    reversedMap[id] = false;
  }

  return {
    id: generateId('session'),
    createdAt: now,
    updatedAt: now,
    spreadType,
    question: '',
    includeQuestionInAi,
    allowReversed,
    phase: 'idle',
    shuffledDeckIds: allIds,
    reversedMap,
    initialCards: [],
    extraCards: [],
    generalNotes: '',
    geminiInterpretation: null,
    chatHistory: [],
    isSavedToHistory: false,
  };
}

/**
 * Performs a cryptographic Fisher–Yates shuffle of all 78 cards and locks in
 * each card's upright/reversed state at shuffle time.
 */
export function shuffleSessionDeck(session: ReadingSession): ReadingSession {
  const allIds = TAROT_DECK.map((c) => c.id);
  const shuffledIds = cryptoFisherYatesShuffle(allIds);
  const reversedMap: Record<string, boolean> = {};

  for (const id of shuffledIds) {
    reversedMap[id] = session.allowReversed ? cryptoRandomBoolean() : false;
  }

  const now = new Date().toISOString();
  return {
    ...session,
    id: generateId('session'),
    createdAt: now,
    updatedAt: now,
    phase: 'selecting',
    shuffledDeckIds: shuffledIds,
    reversedMap,
    initialCards: [],
    extraCards: [],
    geminiInterpretation: null,
    chatHistory: [],
    isSavedToHistory: false,
  };
}

/**
 * Resolves the position title for one of the initial 3 cards (0, 1, 2).
 */
export function getPositionTitle(
  spreadType: SpreadType,
  positionIndex: number,
  customPositions?: [string, string, string]
): string {
  if (customPositions && customPositions[positionIndex]?.trim()) {
    return customPositions[positionIndex].trim();
  }
  const def = SPREAD_DEFINITIONS[spreadType] || SPREAD_DEFINITIONS['past-present-future'];
  return def.positions[positionIndex] || `${positionIndex + 1}. Kart`;
}

/**
 * Selects a card from the remaining face-down deck by deck index during the 3-card selection phase.
 * Card identity and reversed status are permanently locked at selection time.
 */
export function selectInitialCardFromDeck(
  session: ReadingSession,
  deckPositionIndex: number
): ReadingSession {
  if (session.initialCards.length >= 3) {
    return session;
  }
  if (session.shuffledDeckIds.length === 0) {
    return session;
  }

  const safeIndex = Math.max(
    0,
    Math.min(deckPositionIndex, session.shuffledDeckIds.length - 1)
  );
  const chosenCardId = session.shuffledDeckIds[safeIndex];
  const card = getCardById(chosenCardId);
  if (!card) return session;

  // Ensure no duplicate card can ever enter initialCards
  if (session.initialCards.some((c) => c.cardId === chosenCardId)) {
    return session;
  }

  const nextPositionIndex = session.initialCards.length;
  const isReversed = session.allowReversed
    ? Boolean(session.reversedMap[chosenCardId])
    : false;

  const drawnCard: DrawnCard = {
    instanceId: generateId('card'),
    cardId: chosenCardId,
    card,
    positionIndex: nextPositionIndex,
    positionTitle: getPositionTitle(
      session.spreadType,
      nextPositionIndex,
      session.customPositions
    ),
    isExtra: false,
    isReversed,
    isRevealed: false, // Starts face down!
    userNote: '',
    selectedAt: new Date().toISOString(),
  };

  const remainingDeckIds = session.shuffledDeckIds.filter((_, idx) => idx !== safeIndex);
  const updatedInitialCards = [...session.initialCards, drawnCard];
  const nextPhase = updatedInitialCards.length === 3 ? 'reading' : 'selecting';

  return {
    ...session,
    updatedAt: new Date().toISOString(),
    phase: nextPhase,
    shuffledDeckIds: remainingDeckIds,
    initialCards: updatedInitialCards,
  };
}

/**
 * Reveals (flips) a specific card by its instanceId or cardId.
 * Does not alter any card identities or orientations.
 */
export function revealCardInSession(
  session: ReadingSession,
  targetId: string
): ReadingSession {
  const now = new Date().toISOString();
  let changed = false;

  const updatedInitial = session.initialCards.map((item) => {
    if ((item.instanceId === targetId || item.cardId === targetId) && !item.isRevealed) {
      changed = true;
      return { ...item, isRevealed: true, revealedAt: now };
    }
    return item;
  });

  const updatedExtra = session.extraCards.map((item) => {
    if ((item.instanceId === targetId || item.cardId === targetId) && !item.isRevealed) {
      changed = true;
      return { ...item, isRevealed: true, revealedAt: now };
    }
    return item;
  });

  if (!changed) return session;

  return {
    ...session,
    updatedAt: now,
    initialCards: updatedInitial,
    extraCards: updatedExtra,
  };
}

/**
 * Draws a single extra face-down card from the remaining deck ("Bir Kart Daha Çek").
 * Guarantees:
 * - Initial 3 cards are never modified.
 * - Used cards are never repeated.
 * - Stops cleanly when 0 cards remain in shuffledDeckIds.
 * - Reversed state is fixed at draw time.
 */
export function drawExtraCardFromDeck(session: ReadingSession): ReadingSession {
  if (session.initialCards.length < 3) {
    return session;
  }
  if (session.shuffledDeckIds.length === 0) {
    return session;
  }

  const usedIds = new Set([
    ...session.initialCards.map((c) => c.cardId),
    ...session.extraCards.map((c) => c.cardId),
  ]);

  // Filter out any already used IDs defensively and take the top card of the cryptographically shuffled deck
  const availableIds = session.shuffledDeckIds.filter((id) => !usedIds.has(id));
  if (availableIds.length === 0) {
    return {
      ...session,
      shuffledDeckIds: [],
    };
  }

  const chosenCardId = availableIds[0];
  const card = getCardById(chosenCardId);
  if (!card) return session;

  const extraOrder = session.extraCards.length + 1;
  const positionIndex = 3 + session.extraCards.length;
  const isReversed = session.allowReversed
    ? Boolean(session.reversedMap[chosenCardId])
    : false;

  const extraCard: DrawnCard = {
    instanceId: generateId('extra'),
    cardId: chosenCardId,
    card,
    positionIndex,
    positionTitle: `Ek Kart #${extraOrder}`,
    isExtra: true,
    isReversed,
    isRevealed: false, // Starts face down and can be opened in the extra cards area
    userNote: '',
    selectedAt: new Date().toISOString(),
  };

  return {
    ...session,
    updatedAt: new Date().toISOString(),
    shuffledDeckIds: availableIds.slice(1),
    extraCards: [...session.extraCards, extraCard],
  };
}

/**
 * Updates the spread type and dynamically updates position titles of the 3 initial cards
 * without changing their card identities or reversed state.
 */
export function updateSessionSpreadType(
  session: ReadingSession,
  spreadType: SpreadType,
  customPositions?: [string, string, string]
): ReadingSession {
  const updatedInitial = session.initialCards.map((item, idx) => ({
    ...item,
    positionTitle: getPositionTitle(spreadType, idx, customPositions),
  }));

  return {
    ...session,
    updatedAt: new Date().toISOString(),
    spreadType,
    customPositions,
    initialCards: updatedInitial,
  };
}

/**
 * Updates the note for a specific drawn card (initial or extra).
 */
export function updateCardNote(
  session: ReadingSession,
  targetInstanceId: string,
  note: string
): ReadingSession {
  const now = new Date().toISOString();
  return {
    ...session,
    updatedAt: now,
    initialCards: session.initialCards.map((c) =>
      c.instanceId === targetInstanceId ? { ...c, userNote: note } : c
    ),
    extraCards: session.extraCards.map((c) =>
      c.instanceId === targetInstanceId ? { ...c, userNote: note } : c
    ),
  };
}

/**
 * Computes a deterministic signature for the current reading state to prevent duplicate Gemini API requests.
 */
export function computeReadingSignature(session: ReadingSession): string {
  const q = session.includeQuestionInAi ? session.question.trim() : '';
  const initialPart = session.initialCards
    .map((c) => `${c.cardId}:${c.positionTitle}:${c.isReversed ? 'R' : 'U'}:${(c.userNote || '').trim()}`)
    .join('|');
  const extraPart = session.extraCards
    .filter((c) => c.isRevealed)
    .map((c) => `${c.cardId}:${c.positionTitle}:${c.isReversed ? 'R' : 'U'}:${(c.userNote || '').trim()}`)
    .join('|');
  const notesPart = session.generalNotes.trim();
  return `${session.spreadType}::${q}::${initialPart}::${extraPart}::${notesPart}`;
}
