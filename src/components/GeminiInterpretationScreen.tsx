import React, { useState } from 'react';
import {
  Sparkles,
  MessageSquare,
  Send,
  AlertTriangle,
  BookOpen,
  RefreshCw,
  ArrowLeft,
  Compass,
  Eye,
  Layers,
  PlusCircle,
} from 'lucide-react';
import {
  DrawnCard,
  ReadingSession,
  SPREAD_DEFINITIONS,
} from '../types/tarot';
import { resolveCardImageUrl } from '../data/tarotDeck';
import { computeReadingSignature } from '../utils/tarotEngine';
import { LocalApiKeyBanner } from './LocalApiKeyBanner';

interface GeminiInterpretationScreenProps {
  session: ReadingSession;
  isInterpreting: boolean;
  isChatLoading: boolean;
  aiError: string | null;
  aiErrorCode: string | null;
  onRequestGeminiInterpret: (forceRefresh?: boolean) => void;
  onUseClassicalFallback: () => void;
  onSendChatMessage: (message: string) => void;
  onInspectCard: (drawnCard: DrawnCard) => void;
  onBackToTable: () => void;
}

const QUICK_CHAT_PROMPTS = [
  'Bu üç kart aşk hayatı açısından nasıl yorumlanır?',
  'İkinci kartın etkisini biraz daha açıkla.',
  'Yeni çekilen kart önceki yorumu nasıl değiştiriyor?',
  'Bu açılımda hangi semboller öne çıkıyor?',
];

export const GeminiInterpretationScreen: React.FC<GeminiInterpretationScreenProps> = ({
  session,
  isInterpreting,
  isChatLoading,
  aiError,
  aiErrorCode,
  onRequestGeminiInterpret,
  onUseClassicalFallback,
  onSendChatMessage,
  onInspectCard,
  onBackToTable,
}) => {
  const [chatInput, setChatInput] = useState('');

  const allInitialRevealed =
    session.initialCards.length === 3 && session.initialCards.every((c) => c.isRevealed);
  const revealedCards = [
    ...session.initialCards.filter((c) => c.isRevealed),
    ...session.extraCards.filter((c) => c.isRevealed),
  ];

  const currentSignature = computeReadingSignature(session);
  const hasInterpretation = Boolean(session.geminiInterpretation);
  const isSignatureOutdated =
    hasInterpretation &&
    session.geminiInterpretation?.signatureKey !== currentSignature;

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = chatInput.trim();
    if (!trimmed || isChatLoading) return;
    onSendChatMessage(trimmed);
    setChatInput('');
  };

  const handleQuickPrompt = (promptText: string) => {
    if (isChatLoading) return;
    onSendChatMessage(promptText);
  };

  if (!allInitialRevealed) {
    return (
      <div
        className="w-full max-w-3xl mx-auto rounded-2xl bg-[#302139]/75 border border-[#C6A66A]/40 p-6 text-center space-y-4"
        data-testid="gemini-locked-notice"
      >
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#622F48]/70 border border-[#C6A66A]/60 flex items-center justify-center">
          <Sparkles className="w-7 h-7 text-[#C6A66A]" />
        </div>
        <h2 className="text-xl font-serif font-bold text-[#F3E7D1]">
          Önce Üç Kartı Masada Açın
        </h2>
        <p className="text-sm text-[#F3E7D1]/85 max-w-md mx-auto leading-relaxed">
          Gemini ile sembolik tarot yorumlaması yapabilmek için Tarot Masası&apos;nda üç
          kart seçmiş ve üçünü de çevirerek açmış olmanız gerekir.
        </p>
        <button
          type="button"
          onClick={onBackToTable}
          data-testid="return-to-table-btn"
          className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#C6A66A] hover:bg-[#d5b77d] text-[#17141F] font-semibold text-sm inline-flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tarot Masasına Dön</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 min-w-0">
      {/* Header & Active Cards Strip */}
      <section className="rounded-2xl bg-[#302139]/75 border border-[#C6A66A]/40 p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C6A66A]">
              {SPREAD_DEFINITIONS[session.spreadType]?.nameTr}
            </span>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#F3E7D1]">
              Gemini Sembolik Tarot Yorumu
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {!hasInterpretation && (
              <button
                type="button"
                disabled={isInterpreting}
                onClick={() => onRequestGeminiInterpret(false)}
                data-testid="trigger-gemini-interpret-btn"
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#C6A66A] hover:bg-[#d8b97f] text-[#17141F] font-semibold text-xs sm:text-sm inline-flex items-center gap-2 shadow-gold transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {isInterpreting ? 'Yorum Hazırlanıyor...' : 'Gemini ile Yorumla'}
                </span>
              </button>
            )}

            {hasInterpretation && isSignatureOutdated && (
              <button
                type="button"
                disabled={isInterpreting}
                onClick={() => onRequestGeminiInterpret(true)}
                data-testid="refresh-gemini-interpret-btn"
                className="min-h-[44px] px-4 py-2 rounded-xl bg-[#622F48] hover:bg-[#783a58] border border-[#C6A66A] text-[#F3E7D1] font-semibold text-xs sm:text-sm inline-flex items-center gap-2 transition-colors"
              >
                <RefreshCw
                  className={`w-4 h-4 text-[#C6A66A] ${
                    isInterpreting ? 'animate-spin' : ''
                  }`}
                />
                <span>Yeni Ek Kartlarla Yorumu Güncelle</span>
              </button>
            )}
          </div>
        </div>

        {/* Mini Strip of Revealed Cards */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
          {revealedCards.map((dc) => (
            <button
              key={dc.instanceId}
              type="button"
              onClick={() => onInspectCard(dc)}
              className="min-h-[44px] rounded-xl bg-[#17141F]/80 hover:bg-[#17141F] border border-[#C6A66A]/35 p-2 flex flex-col items-center text-center transition-colors min-w-0"
            >
              <div className="w-10 aspect-[10/17] rounded overflow-hidden border border-[#C6A66A]/40 mb-1">
                <img
                  src={resolveCardImageUrl(dc.card.image)}
                  alt={dc.card.nameTr}
                  className={`w-full h-full object-contain ${
                    dc.isReversed ? 'rotate-180' : ''
                  }`}
                />
              </div>
              <span className="text-[10px] text-[#C6A66A] truncate w-full">
                {dc.positionTitle}
              </span>
              <span className="text-[11px] font-serif font-semibold text-[#F3E7D1] truncate w-full">
                {dc.card.nameTr}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Error / Quota Exceeded Banner */}
      {aiError && (
        <section
          role="alert"
          data-testid="gemini-error-banner"
          data-error-code={aiErrorCode || 'ERROR'}
          className="rounded-2xl bg-[#622F48]/45 border-2 border-[#C6A66A] p-4 sm:p-5 space-y-3"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#C6A66A] shrink-0 mt-0.5" />
            <div className="space-y-1.5 min-w-0">
              <h3 className="text-sm sm:text-base font-serif font-bold text-[#F3E7D1]">
                {aiErrorCode === 'QUOTA_EXCEEDED'
                  ? 'Kullanım Limitine Ulaşıldı'
                  : 'Yapay Zekâ Bağlantı Bilgilendirmesi'}
              </h3>
              <p
                className="text-xs sm:text-sm text-[#F3E7D1]/95 leading-relaxed safe-text-wrap"
                data-testid="gemini-error-message"
              >
                {aiError}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onUseClassicalFallback}
              data-testid="use-classical-fallback-btn"
              className="min-h-[44px] px-4 py-2 rounded-xl bg-[#C6A66A] hover:bg-[#d6b77c] text-[#17141F] font-semibold text-xs sm:text-sm inline-flex items-center gap-1.5 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Klasik Rider–Waite Sentezini Göster</span>
            </button>

            <button
              type="button"
              onClick={onBackToTable}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-[#17141F]/85 hover:bg-[#302139] border border-[#C6A66A]/40 text-xs sm:text-sm text-[#F3E7D1] inline-flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-[#C6A66A]" />
              <span>Masaya Dön</span>
            </button>
          </div>

          {(aiErrorCode === 'MISSING_API_KEY' ||
            aiErrorCode === 'INVALID_API_KEY' ||
            aiErrorCode === 'NETWORK_ERROR' ||
            aiErrorCode === 'INVALID_RESPONSE') && (
            <div className="pt-2">
              <LocalApiKeyBanner
                compact
                onKeySaved={() => onRequestGeminiInterpret(true)}
              />
            </div>
          )}
        </section>
      )}

      {/* Loading Indicator */}
      {isInterpreting && (
        <div
          className="rounded-2xl bg-[#302139]/60 border border-[#C6A66A]/35 p-8 text-center space-y-3"
          data-testid="gemini-loading-indicator"
        >
          <Sparkles className="w-8 h-8 text-[#C6A66A] mx-auto animate-pulse" />
          <p className="text-base font-serif text-[#F3E7D1]">
            Kartların sembolik dili ve aralarındaki bağ yorumlanıyor...
          </p>
        </div>
      )}

      {/* Prompt to click "Gemini ile Yorumla" if not yet requested */}
      {!hasInterpretation && !isInterpreting && !aiError && (
        <div
          className="rounded-2xl bg-[#302139]/50 border border-[#C6A66A]/30 p-6 text-center space-y-3"
          data-testid="gemini-ready-prompt"
        >
          <p className="text-sm text-[#F3E7D1]/90 max-w-lg mx-auto leading-relaxed">
            Üç kartınız açıldı. Yukarıdaki{' '}
            <strong className="text-[#C6A66A]">&ldquo;Gemini ile Yorumla&rdquo;</strong>{' '}
            butonuna dokunarak 5 bölümlü detaylı sembolik analizi başlatabilir veya çevrimdışı
            klasik sentezi görüntüleyebilirsiniz.
          </p>
          <button
            type="button"
            onClick={onUseClassicalFallback}
            data-testid="offline-classical-synthesis-btn"
            className="min-h-[44px] px-4 py-2 rounded-xl bg-[#17141F] hover:bg-[#622F48]/70 border border-[#C6A66A]/45 text-xs sm:text-sm text-[#C6A66A] font-medium inline-flex items-center gap-1.5 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>API Çağrısı Yapmadan Klasik Sentezi Gör</span>
          </button>
        </div>
      )}

      {/* 5 Structured Interpretation Sections */}
      {session.geminiInterpretation && !isInterpreting && (
        <div className="space-y-4" data-testid="gemini-interpretation-sections">
          {/* Disclaimer Banner */}
          <div className="rounded-xl bg-[#17141F]/90 border border-[#C6A66A]/30 px-3.5 py-2.5 flex items-center justify-between gap-2 flex-wrap text-[11px] text-[#F3E7D1]/75">
            <span>
              ✦ Bu yorum sembolik bir rehberlik sunar; kesin gelecek tahmini veya bilimsel kanıt iddiası taşımaz.
            </span>
            {session.geminiInterpretation.modelUsed && (
              <span className="text-[#C6A66A] font-medium">
                Kaynak: {session.geminiInterpretation.modelUsed}
              </span>
            )}
          </div>

          {/* SECTION 1: Kartların Bireysel Anlamları */}
          <article
            className="rounded-2xl bg-[#302139]/75 border border-[#C6A66A]/40 p-4 sm:p-5 space-y-3"
            data-testid="section-individual-cards"
          >
            <h3 className="text-base sm:text-lg font-serif font-bold text-[#C6A66A] flex items-center gap-2">
              <Layers className="w-4 h-4 shrink-0" />
              1. Kartların Bireysel Anlamları
            </h3>
            <div className="space-y-3">
              {session.geminiInterpretation.individualCards.map((item, idx) => (
                <div
                  key={`${item.cardId}-${idx}`}
                  className="rounded-xl bg-[#17141F]/80 border border-[#C6A66A]/25 p-3.5 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-[#C6A66A]">
                      {item.positionTitle} — {item.cardNameTr}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-[#302139] text-[#F3E7D1]/85">
                      {item.isReversed ? 'Ters' : 'Düz'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed text-[#F3E7D1]/95 safe-text-wrap">
                    {item.interpretation}
                  </p>
                </div>
              ))}
            </div>
          </article>

          {/* SECTION 2: Üç Kartın Ortak Mesajı */}
          <article
            className="rounded-2xl bg-[#302139]/75 border border-[#C6A66A]/40 p-4 sm:p-5 space-y-2"
            data-testid="section-combined-message"
          >
            <h3 className="text-base sm:text-lg font-serif font-bold text-[#C6A66A] flex items-center gap-2">
              <Compass className="w-4 h-4 shrink-0" />
              2. Üç Kartın Ortak Mesajı
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-[#F3E7D1]/95 whitespace-pre-line safe-text-wrap">
              {session.geminiInterpretation.combinedMessage}
            </p>
          </article>

          {/* SECTION 3: Öne Çıkan Semboller */}
          <article
            className="rounded-2xl bg-[#302139]/75 border border-[#C6A66A]/40 p-4 sm:p-5 space-y-2"
            data-testid="section-prominent-symbols"
          >
            <h3 className="text-base sm:text-lg font-serif font-bold text-[#C6A66A] flex items-center gap-2">
              <Eye className="w-4 h-4 shrink-0" />
              3. Öne Çıkan Semboller
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-[#F3E7D1]/95 whitespace-pre-line safe-text-wrap">
              {session.geminiInterpretation.prominentSymbols}
            </p>
          </article>

          {/* SECTION 4: Dikkat Edilebilecek Temalar */}
          <article
            className="rounded-2xl bg-[#302139]/75 border border-[#C6A66A]/40 p-4 sm:p-5 space-y-2"
            data-testid="section-notable-themes"
          >
            <h3 className="text-base sm:text-lg font-serif font-bold text-[#C6A66A] flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              4. Dikkat Edilebilecek Temalar
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-[#F3E7D1]/95 whitespace-pre-line safe-text-wrap">
              {session.geminiInterpretation.notableThemes}
            </p>
          </article>

          {/* SECTION 5: Ek Kartların Etkisi */}
          <article
            className="rounded-2xl bg-[#302139]/75 border border-[#C6A66A]/40 p-4 sm:p-5 space-y-2"
            data-testid="section-extra-cards-impact"
          >
            <h3 className="text-base sm:text-lg font-serif font-bold text-[#C6A66A] flex items-center gap-2">
              <PlusCircle className="w-4 h-4 shrink-0" />
              5. Ek Kartların Etkisi
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-[#F3E7D1]/95 whitespace-pre-line safe-text-wrap">
              {session.geminiInterpretation.extraCardsImpact}
            </p>
          </article>

          {/* SECTION 7: Follow-up Chat with Gemini */}
          <section
            aria-label="Gemini ile Devam Eden Sohbet"
            data-testid="gemini-followup-chat"
            className="rounded-2xl bg-[#17141F] border-2 border-[#C6A66A]/55 p-4 sm:p-5 space-y-4"
          >
            <div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#F3E7D1] flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#C6A66A]" />
                Bu Açılım Hakkında Soru Sor (Devam Sohbeti)
              </h3>
              <p className="text-xs text-[#F3E7D1]/70 mt-0.5">
                Açılan kartlar ve önceki yorum bağlamı korunarak sembolik sohbet devam eder.
              </p>
            </div>

            {/* Suggested Prompt Chips */}
            <div className="flex flex-wrap gap-2">
              {QUICK_CHAT_PROMPTS.map((qText) => (
                <button
                  key={qText}
                  type="button"
                  disabled={isChatLoading}
                  onClick={() => handleQuickPrompt(qText)}
                  className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#302139]/90 hover:bg-[#622F48] border border-[#C6A66A]/35 text-xs text-[#F3E7D1] text-left transition-colors safe-text-wrap"
                >
                  “{qText}”
                </button>
              ))}
            </div>

            {/* Chat Messages History */}
            {session.chatHistory.length > 0 && (
              <div
                className="space-y-2.5 max-h-80 overflow-y-auto pr-1"
                data-testid="chat-messages-list"
              >
                {session.chatHistory.map((msg) => (
                  <div
                    key={msg.id}
                    className={`rounded-xl p-3 text-xs sm:text-sm leading-relaxed safe-text-wrap ${
                      msg.role === 'user'
                        ? 'bg-[#622F48]/70 border border-[#C6A66A]/40 text-[#F3E7D1] ml-4'
                        : 'bg-[#302139]/90 border border-[#C6A66A]/30 text-[#F3E7D1]/95 mr-4'
                    }`}
                  >
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-[#C6A66A] mb-1">
                      {msg.role === 'user' ? 'Siz' : 'Gemini Tarot Rehberi'}
                    </div>
                    <div className="whitespace-pre-line">{msg.text}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Chat Input Form */}
            <form onSubmit={handleChatSubmit} className="flex items-center gap-2">
              <input
                type="text"
                maxLength={500}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                data-testid="chat-input"
                placeholder="Bu açılımla ilgili merak ettiğiniz bir detayı yazın..."
                className="flex-1 min-w-0 min-h-[44px] rounded-xl bg-[#302139]/75 border border-[#C6A66A]/45 px-3.5 py-2 text-xs sm:text-sm text-[#F3E7D1] placeholder-[#F3E7D1]/45 focus:outline-none focus:border-[#C6A66A]"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isChatLoading}
                data-testid="chat-send-btn"
                aria-label="Mesaj Gönder"
                className="min-h-[44px] min-w-[44px] px-4 py-2 rounded-xl bg-[#C6A66A] hover:bg-[#d6b77c] disabled:opacity-40 text-[#17141F] font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 transition-colors shrink-0"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {isChatLoading ? 'Yanıtlanıyor...' : 'Gönder'}
                </span>
              </button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
};
