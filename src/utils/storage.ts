import { getCardById } from '../data/tarotDeck';
import { AppSettings, DrawnCard, ReadingSession } from '../types/tarot';
import { createInitialSession } from './tarotEngine';

const DB_NAME = 'cagla-tarot-db';
const DB_VERSION = 1;
const STORE_READINGS = 'readings';

const ACTIVE_SESSION_KEY = 'cagla_tarot_active_session_v1';
const SETTINGS_KEY = 'cagla_tarot_settings_v1';
const FALLBACK_HISTORY_KEY = 'cagla_tarot_history_fallback_v1';

export const DEFAULT_SETTINGS: AppSettings = {
  allowReversed: true,
  defaultSpreadType: 'past-present-future',
  animationsEnabled: true,
  includeQuestionByDefault: false,
  privacyNoticeAccepted: false,
  workerApiUrl: import.meta.env.VITE_WORKER_API_URL || '/api/interpret',
  turnstileSiteKey: import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA',
};

/**
 * Rehydrates card objects on DrawnCard items in case cards were serialized.
 */
export function rehydrateSession(raw: ReadingSession): ReadingSession {
  const rehydrateDrawnCard = (dc: DrawnCard): DrawnCard => {
    const freshCard = getCardById(dc.cardId);
    return freshCard ? { ...dc, card: freshCard } : dc;
  };

  return {
    ...raw,
    initialCards: Array.isArray(raw.initialCards)
      ? raw.initialCards.map(rehydrateDrawnCard)
      : [],
    extraCards: Array.isArray(raw.extraCards)
      ? raw.extraCards.map(rehydrateDrawnCard)
      : [],
    chatHistory: Array.isArray(raw.chatHistory) ? raw.chatHistory : [],
    shuffledDeckIds: Array.isArray(raw.shuffledDeckIds) ? raw.shuffledDeckIds : [],
    reversedMap: raw.reversedMap && typeof raw.reversedMap === 'object' ? raw.reversedMap : {},
  };
}

export function loadAppSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveAppSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadActiveSession(settings: AppSettings = loadAppSettings()): ReadingSession {
  try {
    const raw = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (!raw) {
      return createInitialSession(
        settings.defaultSpreadType,
        settings.allowReversed,
        settings.includeQuestionByDefault
      );
    }
    const parsed = JSON.parse(raw) as ReadingSession;
    if (!parsed || !parsed.id || !Array.isArray(parsed.initialCards)) {
      return createInitialSession(
        settings.defaultSpreadType,
        settings.allowReversed,
        settings.includeQuestionByDefault
      );
    }
    return rehydrateSession(parsed);
  } catch {
    return createInitialSession(
      settings.defaultSpreadType,
      settings.allowReversed,
      settings.includeQuestionByDefault
    );
  }
}

export function saveActiveSession(session: ReadingSession): void {
  try {
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(session));
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Opens the IndexedDB database for readings history.
 */
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB mevcut değil'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_READINGS)) {
        const store = db.createObjectStore(STORE_READINGS, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('IndexedDB açılamadı'));
  });
}

function getFallbackHistory(): ReadingSession[] {
  try {
    const raw = localStorage.getItem(FALLBACK_HISTORY_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as ReadingSession[];
    return Array.isArray(list) ? list.map(rehydrateSession) : [];
  } catch {
    return [];
  }
}

function setFallbackHistory(sessions: ReadingSession[]): void {
  try {
    localStorage.setItem(FALLBACK_HISTORY_KEY, JSON.stringify(sessions));
  } catch {
    // Ignore
  }
}

export async function saveReadingToHistory(session: ReadingSession): Promise<ReadingSession> {
  const toSave: ReadingSession = {
    ...session,
    updatedAt: new Date().toISOString(),
    isSavedToHistory: true,
  };

  // Also keep fallback in localStorage for instant resilience
  const currentFallback = getFallbackHistory();
  const existingIdx = currentFallback.findIndex((s) => s.id === toSave.id);
  if (existingIdx >= 0) {
    currentFallback[existingIdx] = toSave;
  } else {
    currentFallback.unshift(toSave);
  }
  setFallbackHistory(currentFallback.slice(0, 200));

  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_READINGS, 'readwrite');
      const store = tx.objectStore(STORE_READINGS);
      store.put(toSave);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error);
      };
    });
  } catch {
    // Fallback already saved
  }

  return toSave;
}

export async function getAllSavedReadings(): Promise<ReadingSession[]> {
  try {
    const db = await openDatabase();
    const records = await new Promise<ReadingSession[]>((resolve, reject) => {
      const tx = db.transaction(STORE_READINGS, 'readonly');
      const store = tx.objectStore(STORE_READINGS);
      const req = store.getAll();
      req.onsuccess = () => {
        db.close();
        resolve((req.result || []) as ReadingSession[]);
      };
      req.onerror = () => {
        db.close();
        reject(req.error);
      };
    });

    const mergedMap = new Map<string, ReadingSession>();
    for (const item of getFallbackHistory()) {
      mergedMap.set(item.id, rehydrateSession(item));
    }
    for (const item of records) {
      mergedMap.set(item.id, rehydrateSession(item));
    }

    return Array.from(mergedMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch {
    return getFallbackHistory().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}

export async function deleteSavedReading(id: string): Promise<void> {
  const updatedFallback = getFallbackHistory().filter((s) => s.id !== id);
  setFallbackHistory(updatedFallback);

  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_READINGS, 'readwrite');
      const store = tx.objectStore(STORE_READINGS);
      store.delete(id);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error);
      };
    });
  } catch {
    // Fallback already updated
  }
}

export async function clearAllSavedReadings(): Promise<void> {
  setFallbackHistory([]);
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_READINGS, 'readwrite');
      const store = tx.objectStore(STORE_READINGS);
      store.clear();
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error);
      };
    });
  } catch {
    // Ignore
  }
}

export interface ExportBackupPayload {
  app: 'cagla-tarot';
  version: string;
  exportedAt: string;
  settings: AppSettings;
  readings: ReadingSession[];
}

export async function exportReadingsToJson(): Promise<string> {
  const readings = await getAllSavedReadings();
  const settings = loadAppSettings();
  const payload: ExportBackupPayload = {
    app: 'cagla-tarot',
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    settings,
    readings,
  };
  return JSON.stringify(payload, null, 2);
}

export async function importReadingsFromJson(jsonText: string): Promise<{
  importedCount: number;
}> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error('Geçersiz JSON dosya formatı.');
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Yedek verisi okunamadı.');
  }

  const obj = parsed as Partial<ExportBackupPayload> & { readings?: ReadingSession[] };
  const list = Array.isArray(obj.readings)
    ? obj.readings
    : Array.isArray(parsed)
    ? (parsed as ReadingSession[])
    : null;

  if (!list) {
    throw new Error('JSON içinde geçerli bir "readings" (açılımlar) listesi bulunamadı.');
  }

  let importedCount = 0;
  for (const item of list) {
    if (item && typeof item.id === 'string' && Array.isArray(item.initialCards)) {
      const hydrated = rehydrateSession(item);
      await saveReadingToHistory(hydrated);
      importedCount++;
    }
  }

  return { importedCount };
}

/**
 * Anonymizes personal identifiers (emails, phone numbers, explicit client name tags)
 * before sending any text to Gemini API.
 */
export function anonymizeTextForAi(input: string): string {
  if (!input) return '';
  return input
    // Mask email addresses
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[E-POSTA GİZLENDİ]')
    // Mask Turkish / international phone numbers
    .replace(/(?:\+90|0)?\s*5\d{2}[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}/g, '[TELEFON GİZLENDİ]')
    // Mask explicit "Danışan Adı: ..." or "İsim: ..." prefixes
    .replace(/(?:danışan(?:ın)?\s*adı|isim\s*soyisim|ad\s*soyad)\s*[:=-]\s*[^\n,.]+/gi, 'Danışan: [ANONİM]')
    .trim();
}
