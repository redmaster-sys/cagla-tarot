import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Layers,
  BookOpen,
  History,
  Settings,
} from 'lucide-react';
import {
  AppSettings,
  DrawnCard,
  ReadingSession,
  SpreadType,
  TarotCard,
} from './types/tarot';
import {
  createInitialSession,
  shuffleSessionDeck,
  selectInitialCardFromDeck,
  revealCardInSession,
  drawExtraCardFromDeck,
  updateSessionSpreadType,
  updateCardNote,
  computeReadingSignature,
  generateId,
} from './utils/tarotEngine';
import {
  loadAppSettings,
  saveAppSettings,
  loadActiveSession,
  saveActiveSession,
  saveReadingToHistory,
  getAllSavedReadings,
  deleteSavedReading,
  clearAllSavedReadings,
  exportReadingsToJson,
  importReadingsFromJson,
} from './utils/storage';
import {
  requestGeminiInterpretation,
  requestGeminiFollowUpChat,
  buildClassicalFallbackSynthesis,
  getSavedDeviceApiKey,
  GeminiServiceError,
} from './services/geminiClient';
import { TarotTableScreen } from './components/TarotTableScreen';
import { GeminiInterpretationScreen } from './components/GeminiInterpretationScreen';
import { CardLibraryScreen } from './components/CardLibraryScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { CardDetailModal } from './components/CardDetailModal';
import { PrivacyConsentModal } from './components/PrivacyConsentModal';
import { LocalApiKeyBanner } from './components/LocalApiKeyBanner';

export type ActiveTab = 'table' | 'gemini' | 'library' | 'history' | 'settings';

const NAV_ITEMS: Array<{
  id: ActiveTab;
  labelTr: string;
  shortLabelTr: string;
  icon: React.FC<{ className?: string }>;
}> = [
  { id: 'table', labelTr: 'Tarot Masası', shortLabelTr: 'Masa', icon: Layers },
  { id: 'gemini', labelTr: 'Gemini Yorumları', shortLabelTr: 'Yorum', icon: Sparkles },
  { id: 'library', labelTr: 'Kart Kütüphanesi', shortLabelTr: '78 Kart', icon: BookOpen },
  { id: 'history', labelTr: 'Geçmiş Açılımlar', shortLabelTr: 'Geçmiş', icon: History },
  { id: 'settings', labelTr: 'Ayarlar', shortLabelTr: 'Ayarlar', icon: Settings },
];

export const App: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(() => loadAppSettings());
  const [session, setSession] = useState<ReadingSession>(() =>
    loadActiveSession(loadAppSettings())
  );
  const [activeTab, setActiveTab] = useState<ActiveTab>('table');
  const [savedReadings, setSavedReadings] = useState<ReadingSession[]>([]);

  // Modal states
  const [inspectedDrawnCard, setInspectedDrawnCard] = useState<DrawnCard | null>(null);
  const [inspectedLibraryCard, setInspectedLibraryCard] = useState<TarotCard | null>(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [pendingForceRefresh, setPendingForceRefresh] = useState(false);

  // AI loading & error states
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiErrorCode, setAiErrorCode] = useState<string | null>(null);
  const [needsServerApiKey, setNeedsServerApiKey] = useState(false);

  useEffect(() => {
    if (getSavedDeviceApiKey()) {
      setNeedsServerApiKey(false);
      return;
    }
    if (
      typeof window !== 'undefined' &&
      window.location.hostname.endsWith('.github.io')
    ) {
      setNeedsServerApiKey(true);
      return;
    }
    fetch('/api/health')
      .then(async (r) => {
        if (!r.ok) return;
        const data = (await r.json()) as { ok?: boolean; hasApiKey?: boolean };
        if (data && data.ok && data.hasApiKey === false) {
          setNeedsServerApiKey(true);
        }
      })
      .catch(() => {
        // Ignore in offline or test mode
      });
  }, []);

  // Persist active session on every change
  useEffect(() => {
    saveActiveSession(session);
  }, [session]);

  // Persist settings on every change
  useEffect(() => {
    saveAppSettings(settings);
  }, [settings]);

  // Load saved readings from IndexedDB
  const refreshHistoryList = useCallback(async () => {
    const list = await getAllSavedReadings();
    setSavedReadings(list);
  }, []);

  useEffect(() => {
    refreshHistoryList();
  }, [refreshHistoryList]);

  // Handlers for Tarot Masası
  const handleUpdateQuestion = (question: string) => {
    setSession((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      question,
    }));
  };

  const handleToggleIncludeQuestion = (include: boolean) => {
    setSession((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      includeQuestionInAi: include,
    }));
  };

  const handleChangeSpreadType = (spreadType: SpreadType) => {
    setSession((prev) => updateSessionSpreadType(prev, spreadType));
  };

  const handleToggleAllowReversed = (allowReversed: boolean) => {
    setSession((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      allowReversed,
    }));
  };

  const handleUpdateGeneralNotes = (generalNotes: string) => {
    setSession((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      generalNotes,
    }));
  };

  const handleUpdateCardNote = (instanceId: string, note: string) => {
    setSession((prev) => {
      const next = updateCardNote(prev, instanceId, note);
      if (inspectedDrawnCard && inspectedDrawnCard.instanceId === instanceId) {
        setInspectedDrawnCard({ ...inspectedDrawnCard, userNote: note });
      }
      return next;
    });
  };

  const handleShuffleDeck = () => {
    setAiError(null);
    setAiErrorCode(null);
    setSession((prev) => shuffleSessionDeck(prev));
  };

  const handleSelectCardFromDeck = (deckIndex: number) => {
    setSession((prev) => selectInitialCardFromDeck(prev, deckIndex));
  };

  const handleRevealCard = (instanceId: string) => {
    setSession((prev) => revealCardInSession(prev, instanceId));
  };

  const handleDrawExtraCard = () => {
    setSession((prev) => drawExtraCardFromDeck(prev));
  };

  const handleResetSession = () => {
    setAiError(null);
    setAiErrorCode(null);
    setSession(
      createInitialSession(
        settings.defaultSpreadType,
        settings.allowReversed,
        settings.includeQuestionByDefault
      )
    );
  };

  const handleSaveReading = async () => {
    const saved = await saveReadingToHistory(session);
    setSession(saved);
    await refreshHistoryList();
  };

  // Gemini Interpretation Execution
  const executeGeminiInterpretation = async (forceRefresh = false) => {
    setActiveTab('gemini');
    setAiError(null);
    setAiErrorCode(null);

    const currentSig = computeReadingSignature(session);
    if (
      !forceRefresh &&
      session.geminiInterpretation &&
      session.geminiInterpretation.signatureKey === currentSig
    ) {
      // Cached interpretation matches exact current cards & notes — do not make redundant API call
      return;
    }

    setIsInterpreting(true);
    try {
      const result = await requestGeminiInterpretation({
        session,
        workerApiUrl: settings.workerApiUrl,
        turnstileToken: 'cagla-tarot-verified-token',
      });

      setSession((prev) => {
        const next: ReadingSession = {
          ...prev,
          updatedAt: new Date().toISOString(),
          geminiInterpretation: result,
        };
        if (next.isSavedToHistory) {
          saveReadingToHistory(next).then(refreshHistoryList);
        }
        return next;
      });
    } catch (err: unknown) {
      if (err instanceof GeminiServiceError) {
        setAiError(err.message);
        setAiErrorCode(err.code);
      } else {
        setAiError(
          'Yapay zekâ servisine bağlanırken beklenmeyen bir hata oluştu. Kartları açmaya ve klasik anlamları incelemeye devam edebilirsiniz.'
        );
        setAiErrorCode('UNKNOWN_ERROR');
      }
    } finally {
      setIsInterpreting(false);
    }
  };

  const handleRequestGeminiInterpret = (forceRefresh = false) => {
    const currentSig = computeReadingSignature(session);
    if (
      !forceRefresh &&
      session.geminiInterpretation &&
      session.geminiInterpretation.signatureKey === currentSig
    ) {
      setActiveTab('gemini');
      return;
    }

    if (!settings.privacyNoticeAccepted) {
      setPendingForceRefresh(forceRefresh);
      setShowPrivacyModal(true);
      return;
    }

    executeGeminiInterpretation(forceRefresh);
  };

  const handleConfirmPrivacyModal = () => {
    setShowPrivacyModal(false);
    setSettings((prev) => ({ ...prev, privacyNoticeAccepted: true }));
    executeGeminiInterpretation(pendingForceRefresh);
  };

  const handleUseClassicalFallback = () => {
    setAiError(null);
    setAiErrorCode(null);
    const classicalResult = buildClassicalFallbackSynthesis(session);
    setSession((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      geminiInterpretation: classicalResult,
    }));
  };

  const handleSendChatMessage = async (messageText: string) => {
    setAiError(null);
    setAiErrorCode(null);

    const userMsg = {
      id: generateId('chat'),
      role: 'user' as const,
      text: messageText,
      createdAt: new Date().toISOString(),
    };

    const updatedWithUser: ReadingSession = {
      ...session,
      updatedAt: new Date().toISOString(),
      chatHistory: [...session.chatHistory, userMsg],
    };
    setSession(updatedWithUser);
    setIsChatLoading(true);

    try {
      const response = await requestGeminiFollowUpChat({
        session: updatedWithUser,
        chatMessage: messageText,
        workerApiUrl: settings.workerApiUrl,
        turnstileToken: 'cagla-tarot-verified-token',
      });

      const assistantMsg = {
        id: generateId('chat'),
        role: 'assistant' as const,
        text: response.reply,
        createdAt: new Date().toISOString(),
      };

      setSession((prev) => ({
        ...prev,
        updatedAt: new Date().toISOString(),
        chatHistory: [...prev.chatHistory, assistantMsg],
      }));
    } catch (err: unknown) {
      if (err instanceof GeminiServiceError) {
        setAiError(err.message);
        setAiErrorCode(err.code);
      } else {
        setAiError('Sohbet yanıtı alınırken bir hata oluştu.');
        setAiErrorCode('CHAT_ERROR');
      }
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleOpenSavedReading = (saved: ReadingSession) => {
    setAiError(null);
    setAiErrorCode(null);
    setSession(saved);
    setActiveTab('table');
  };

  const handleDeleteSavedReading = async (id: string) => {
    await deleteSavedReading(id);
    if (session.id === id) {
      setSession((prev) => ({ ...prev, isSavedToHistory: false }));
    }
    await refreshHistoryList();
  };

  const handleExportJson = async () => {
    const jsonString = await exportReadingsToJson();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cagla-tarot-yedek-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportJson = async (jsonText: string) => {
    const res = await importReadingsFromJson(jsonText);
    await refreshHistoryList();
    return res;
  };

  const handleClearHistory = async () => {
    await clearAllSavedReadings();
    setSession((prev) => ({ ...prev, isSavedToHistory: false }));
    await refreshHistoryList();
  };

  return (
    <div className="min-h-[100dvh] w-full max-w-full overflow-x-hidden flex flex-col bg-[#17141F] text-[#F3E7D1]">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#17141F]/95 backdrop-blur-md border-b border-[#C6A66A]/30 safe-top">
        <div className="max-w-5xl mx-auto px-3 sm:px-5 py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#302139] border border-[#C6A66A] flex items-center justify-center shadow-gold shrink-0">
              <Sparkles className="w-4 h-4 text-[#C6A66A]" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-serif font-bold tracking-wide text-[#F3E7D1] truncate">
                Çağla Tarot
              </h1>
              <p className="text-[10px] sm:text-xs text-[#C6A66A] truncate">
                Dijital Tarot Masası • 78 Rider–Waite Kartı
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav
            aria-label="Ana Menü (Masaüstü)"
            className="hidden md:flex items-center gap-1.5"
          >
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  data-testid={`desktop-nav-${item.id}`}
                  className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 border transition-all ${
                    isActive
                      ? 'bg-[#622F48] border-[#C6A66A] text-[#F3E7D1] shadow-gold'
                      : 'bg-[#302139]/60 border-transparent text-[#F3E7D1]/80 hover:border-[#C6A66A]/40'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#C6A66A]" />
                  <span>{item.labelTr}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-2.5 sm:px-5 pt-3 sm:pt-5 main-scroll-padding min-w-0 space-y-4">
        {needsServerApiKey && (
          <LocalApiKeyBanner
            compact
            onKeySaved={() => {
              setNeedsServerApiKey(false);
              setAiError(null);
              setAiErrorCode(null);
            }}
          />
        )}

        {activeTab === 'table' && (
          <TarotTableScreen
            session={session}
            animationsEnabled={settings.animationsEnabled}
            isInterpreting={isInterpreting}
            onUpdateQuestion={handleUpdateQuestion}
            onToggleIncludeQuestion={handleToggleIncludeQuestion}
            onChangeSpreadType={handleChangeSpreadType}
            onToggleAllowReversed={handleToggleAllowReversed}
            onUpdateGeneralNotes={handleUpdateGeneralNotes}
            onUpdateCardNote={handleUpdateCardNote}
            onShuffleDeck={handleShuffleDeck}
            onSelectCardFromDeck={handleSelectCardFromDeck}
            onRevealCard={handleRevealCard}
            onDrawExtraCard={handleDrawExtraCard}
            onInspectCard={(dc) => setInspectedDrawnCard(dc)}
            onRequestGeminiInterpret={() => handleRequestGeminiInterpret(false)}
            onSaveReading={handleSaveReading}
            onResetSession={handleResetSession}
          />
        )}

        {activeTab === 'gemini' && (
          <GeminiInterpretationScreen
            session={session}
            isInterpreting={isInterpreting}
            isChatLoading={isChatLoading}
            aiError={aiError}
            aiErrorCode={aiErrorCode}
            onRequestGeminiInterpret={(force) => handleRequestGeminiInterpret(Boolean(force))}
            onUseClassicalFallback={handleUseClassicalFallback}
            onSendChatMessage={handleSendChatMessage}
            onInspectCard={(dc) => setInspectedDrawnCard(dc)}
            onBackToTable={() => setActiveTab('table')}
          />
        )}

        {activeTab === 'library' && (
          <CardLibraryScreen
            onSelectCard={(card) => setInspectedLibraryCard(card)}
          />
        )}

        {activeTab === 'history' && (
          <HistoryScreen
            readings={savedReadings}
            onOpenReading={handleOpenSavedReading}
            onDeleteReading={handleDeleteSavedReading}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsScreen
            settings={settings}
            onUpdateSettings={setSettings}
            onExportJson={handleExportJson}
            onImportJson={handleImportJson}
            onClearHistory={handleClearHistory}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Alt Gezinme Menüsü"
        data-testid="mobile-bottom-nav"
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#17141F]/95 backdrop-blur-md border-t border-[#C6A66A]/35 safe-bottom-nav"
      >
        <div className="grid grid-cols-5 w-full max-w-lg mx-auto px-1 pt-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                data-testid={`nav-tab-${item.id}`}
                aria-current={isActive ? 'page' : undefined}
                className={`min-h-[48px] min-w-[44px] py-1 px-0.5 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-colors ${
                  isActive
                    ? 'text-[#C6A66A] bg-[#302139]/90 font-semibold'
                    : 'text-[#F3E7D1]/70 hover:text-[#F3E7D1]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-[10px] leading-tight truncate max-w-full px-0.5">
                  {item.shortLabelTr}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Card Detail Modal */}
      {(inspectedDrawnCard || inspectedLibraryCard) && (
        <CardDetailModal
          card={inspectedLibraryCard}
          drawnCard={inspectedDrawnCard}
          onClose={() => {
            setInspectedDrawnCard(null);
            setInspectedLibraryCard(null);
          }}
          onSaveCardNote={handleUpdateCardNote}
        />
      )}

      {/* Privacy & Free-Tier Consent Modal */}
      <PrivacyConsentModal
        isOpen={showPrivacyModal}
        includeQuestion={session.includeQuestionInAi}
        hasQuestionText={Boolean(session.question.trim())}
        onConfirm={handleConfirmPrivacyModal}
        onCancel={() => setShowPrivacyModal(false)}
      />
    </div>
  );
};

export default App;
