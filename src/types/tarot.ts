export type ArcanaCategory = 'major' | 'minor';

export type TarotSuit = 'none' | 'wands' | 'cups' | 'swords' | 'pentacles';

export type SpreadType = 'past-present-future' | 'situation-obstacle-advice' | 'free';

export interface TarotCard {
  id: string;
  nameTr: string;
  nameEn: string;
  arcana: ArcanaCategory;
  arcanaLabelTr: string;
  suit: TarotSuit;
  suitLabelTr: string;
  number: number;
  romanOrRank: string;
  image: string; // e.g., "cards/major-00.jpg"
  uprightMeaning: string;
  reversedMeaning: string;
  symbolicDescription: string;
  keywords: string[];
}

export interface DrawnCard {
  instanceId: string; // Unique to this draw position
  cardId: string;
  card: TarotCard;
  positionIndex: number; // 0, 1, 2 for initial 3 cards; 3+ for extra cards
  positionTitle: string; // e.g., "Geçmiş", "Şimdi", "Gelecek" or "Ek Kart #1"
  isExtra: boolean;
  isReversed: boolean; // Fixed at selection time
  isRevealed: boolean; // Starts false, flipped when user taps
  userNote?: string;   // Optional note per card (especially for extra cards)
  selectedAt: string;  // ISO timestamp when chosen
  revealedAt?: string; // ISO timestamp when revealed
}

export interface GeminiInterpretationResult {
  individualCards: Array<{
    cardId: string;
    cardNameTr: string;
    positionTitle: string;
    isReversed: boolean;
    interpretation: string;
  }>;
  combinedMessage: string;
  prominentSymbols: string;
  notableThemes: string;
  extraCardsImpact: string;
  modelUsed?: string;
  generatedAt: string;
  signatureKey: string; // Hash of spread + question + revealed cards + notes to prevent duplicate API calls
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  createdAt: string;
}

export type ReadingPhase = 'idle' | 'shuffling' | 'selecting' | 'reading';

export interface ReadingSession {
  id: string;
  createdAt: string;
  updatedAt: string;
  spreadType: SpreadType;
  customPositions?: [string, string, string];
  question: string;
  includeQuestionInAi: boolean;
  allowReversed: boolean;
  phase: ReadingPhase;
  shuffledDeckIds: string[]; // Remaining deck IDs in cryptographically shuffled order
  reversedMap: Record<string, boolean>; // Pre-locked orientation per cardId at shuffle/selection time
  initialCards: DrawnCard[]; // Up to 3 cards
  extraCards: DrawnCard[];   // 0..75 cards
  generalNotes: string;
  geminiInterpretation: GeminiInterpretationResult | null;
  chatHistory: ChatMessage[];
  isSavedToHistory?: boolean;
}

export interface AppSettings {
  allowReversed: boolean;
  defaultSpreadType: SpreadType;
  animationsEnabled: boolean;
  includeQuestionByDefault: boolean;
  privacyNoticeAccepted: boolean;
  workerApiUrl: string;
  turnstileSiteKey: string;
}

export const SPREAD_DEFINITIONS: Record<
  SpreadType,
  {
    id: SpreadType;
    nameTr: string;
    descriptionTr: string;
    positions: [string, string, string];
  }
> = {
  'past-present-future': {
    id: 'past-present-future',
    nameTr: 'Geçmiş / Şimdi / Gelecek',
    descriptionTr: 'Olayların kökenini, şu anki enerjiyi ve olası yönelimi zaman akışıyla inceler.',
    positions: ['Geçmiş', 'Şimdi', 'Gelecek'],
  },
  'situation-obstacle-advice': {
    id: 'situation-obstacle-advice',
    nameTr: 'Durum / Engel / Tavsiye',
    descriptionTr: 'Mevcut konuyu, karşılaşılan içsel veya dışsal direnci ve rehber niteliğindeki yaklaşımı gösterir.',
    positions: ['Mevcut Durum', 'Karşılaşılan Engel', 'Sembolik Tavsiye'],
  },
  free: {
    id: 'free',
    nameTr: 'Serbest Açılım',
    descriptionTr: 'Pozisyon kısıtlaması olmadan sezgisel ve bütüncül okuma alanı sunar.',
    positions: ['1. Kart (Odak)', '2. Kart (Dinamik)', '3. Kart (Sentez)'],
  },
};
