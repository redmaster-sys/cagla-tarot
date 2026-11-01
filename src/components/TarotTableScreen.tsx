import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shuffle,
  Sparkles,
  PlusCircle,
  BookmarkCheck,
  RotateCcw,
  Layers,
  HelpCircle,
  Lock,
  Unlock,
  PenLine,
  Eye,
} from 'lucide-react';
import {
  DrawnCard,
  ReadingSession,
  SpreadType,
  SPREAD_DEFINITIONS,
} from '../types/tarot';
import { TarotCardView } from './TarotCardView';

interface TarotTableScreenProps {
  session: ReadingSession;
  animationsEnabled: boolean;
  isInterpreting: boolean;
  onUpdateQuestion: (question: string) => void;
  onToggleIncludeQuestion: (include: boolean) => void;
  onChangeSpreadType: (spreadType: SpreadType) => void;
  onToggleAllowReversed: (allow: boolean) => void;
  onUpdateGeneralNotes: (notes: string) => void;
  onUpdateCardNote: (instanceId: string, note: string) => void;
  onShuffleDeck: () => void;
  onSelectCardFromDeck: (deckIndex: number) => void;
  onRevealCard: (instanceId: string) => void;
  onDrawExtraCard: () => void;
  onInspectCard: (drawnCard: DrawnCard) => void;
  onRequestGeminiInterpret: () => void;
  onSaveReading: () => void;
  onResetSession: () => void;
}

export const TarotTableScreen: React.FC<TarotTableScreenProps> = ({
  session,
  animationsEnabled,
  isInterpreting,
  onUpdateQuestion,
  onToggleIncludeQuestion,
  onChangeSpreadType,
  onToggleAllowReversed,
  onUpdateGeneralNotes,
  onUpdateCardNote,
  onShuffleDeck,
  onSelectCardFromDeck,
  onRevealCard,
  onDrawExtraCard,
  onInspectCard,
  onRequestGeminiInterpret,
  onSaveReading,
  onResetSession,
}) => {
  const [isShufflingAnim, setIsShufflingAnim] = useState(false);

  const allInitialSelected = session.initialCards.length === 3;
  const allInitialRevealed =
    allInitialSelected && session.initialCards.every((c) => c.isRevealed);
  const revealedInitialCards = session.initialCards.filter((c) => c.isRevealed);
  const remainingDeckCount = session.shuffledDeckIds.length;

  const handleTriggerShuffle = () => {
    if (animationsEnabled) {
      setIsShufflingAnim(true);
      setTimeout(() => {
        onShuffleDeck();
        setIsShufflingAnim(false);
      }, 650);
    } else {
      onShuffleDeck();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-5 min-w-0">
      {/* 1. Spread Configuration & Question Box */}
      <section
        aria-label="Açılım Ayarları ve Soru"
        className="rounded-2xl bg-[#302139]/70 border border-[#C6A66A]/35 p-3.5 sm:p-5 shadow-lg space-y-3.5"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Layers className="w-4 h-4 text-[#C6A66A] shrink-0" />
            <h2 className="text-sm sm:text-base font-serif font-bold text-[#F3E7D1] truncate">
              Açılım Düzeni ve Niyet
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Reversed Mode Quick Toggle */}
            <button
              type="button"
              onClick={() => onToggleAllowReversed(!session.allowReversed)}
              data-testid="toggle-reversed-btn"
              className={`min-h-[44px] px-3 py-1.5 rounded-xl border text-xs font-medium inline-flex items-center gap-1.5 transition-colors ${
                session.allowReversed
                  ? 'bg-[#622F48]/80 border-[#C6A66A] text-[#F3E7D1]'
                  : 'bg-[#17141F]/80 border-[#C6A66A]/30 text-[#F3E7D1]/75'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#C6A66A]" />
              <span>Ters Kart: {session.allowReversed ? 'Açık' : 'Kapalı'}</span>
            </button>
          </div>
        </div>

        {/* Spread Type Selector Pills */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-2"
          role="radiogroup"
          aria-label="Üç Kart Açılım Tipi"
        >
          {(Object.keys(SPREAD_DEFINITIONS) as SpreadType[]).map((typeKey) => {
            const def = SPREAD_DEFINITIONS[typeKey];
            const isSelected = session.spreadType === typeKey;
            return (
              <button
                key={typeKey}
                type="button"
                role="radio"
                aria-checked={isSelected}
                data-testid={`spread-type-${typeKey}`}
                onClick={() => onChangeSpreadType(typeKey)}
                className={`min-h-[44px] px-3 py-2 rounded-xl border text-left transition-all min-w-0 ${
                  isSelected
                    ? 'bg-[#622F48] border-[#C6A66A] text-[#F3E7D1] shadow-gold'
                    : 'bg-[#17141F]/75 border-[#C6A66A]/25 text-[#F3E7D1]/80 hover:border-[#C6A66A]/60'
                }`}
              >
                <div className="text-xs sm:text-sm font-semibold truncate">
                  {def.nameTr}
                </div>
                <div className="text-[11px] text-[#C6A66A] truncate mt-0.5">
                  {def.positions.join(' • ')}
                </div>
              </button>
            );
          })}
        </div>

        {/* Optional Question Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <label
              htmlFor="tarot-question-input"
              className="text-xs sm:text-sm font-medium text-[#F3E7D1]/90 flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#C6A66A]" />
              Odaklanılan Soru veya Niyet (İsteğe Bağlı)
            </label>
            <button
              type="button"
              onClick={() => onToggleIncludeQuestion(!session.includeQuestionInAi)}
              data-testid="toggle-question-privacy-btn"
              className="min-h-[44px] px-2.5 py-1 rounded-lg bg-[#17141F]/80 border border-[#C6A66A]/35 text-[11px] text-[#C6A66A] inline-flex items-center gap-1.5 hover:border-[#C6A66A]"
            >
              {session.includeQuestionInAi ? (
                <>
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Soruyu Gemini&apos;ye Gönder: Açık</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Soruyu Gemini&apos;ye Gönder: Gizli</span>
                </>
              )}
            </button>
          </div>
          <input
            id="tarot-question-input"
            type="text"
            maxLength={350}
            value={session.question}
            onChange={(e) => onUpdateQuestion(e.target.value)}
            data-testid="question-input"
            placeholder="Örn: Önümüzdeki süreçte kariyer ve içsel dengem için neye dikkat etmeliyim?"
            className="w-full min-h-[44px] rounded-xl bg-[#17141F] border border-[#C6A66A]/40 px-3.5 py-2.5 text-sm text-[#F3E7D1] placeholder-[#F3E7D1]/40 focus:outline-none focus:border-[#C6A66A]"
          />
        </div>
      </section>

      {/* 2. Velvet Tarot Table Surface */}
      <section
        aria-label="Dijital Tarot Masası"
        data-testid="velvet-tarot-table"
        className="velvet-surface rounded-2xl border-2 border-[#C6A66A]/60 p-3 sm:p-5 space-y-5 overflow-hidden"
      >
        {/* Top Table Status & Shuffle Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-[#C6A66A]/25 pb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#C6A66A]" />
              <span
                className="text-xs sm:text-sm font-semibold text-[#F3E7D1]"
                data-testid="deck-remaining-count"
              >
                Kalan Deste: {remainingDeckCount} / 78 Kart
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#C6A66A]/90 mt-0.5 safe-text-wrap">
              {session.phase === 'idle' &&
                '78 kartlık Rider–Waite–Smith destesi kapalı olarak masada. Başlamak için desteyi karıştırın.'}
              {session.phase === 'selecting' &&
                `Desteden ${
                  3 - session.initialCards.length
                } kapalı kart daha seçin (${session.initialCards.length}/3 seçildi).`}
              {session.phase === 'reading' &&
                !allInitialRevealed &&
                'Masadaki kapalı kartlara sırayla dokunarak kartları açın.'}
              {session.phase === 'reading' &&
                allInitialRevealed &&
                'Üç kart açıldı! Klasik anlamları inceleyebilir, ek kart çekebilir veya Gemini ile yorumlatabilirsiniz.'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleTriggerShuffle}
              data-testid="shuffle-deck-btn"
              className="min-h-[44px] px-4 py-2 rounded-xl bg-[#C6A66A] hover:bg-[#d6b77c] text-[#17141F] font-semibold text-xs sm:text-sm inline-flex items-center gap-2 shadow-gold transition-colors"
            >
              <Shuffle
                className={`w-4 h-4 ${isShufflingAnim ? 'animate-spin' : ''}`}
              />
              <span>
                {session.phase === 'idle' ? 'Desteyi Karıştır' : 'Yeniden Karıştır'}
              </span>
            </button>

            {(session.initialCards.length > 0 || session.phase !== 'idle') && (
              <button
                type="button"
                onClick={onResetSession}
                data-testid="reset-table-btn"
                className="min-h-[44px] px-3 py-2 rounded-xl bg-[#17141F]/90 hover:bg-[#622F48]/70 border border-[#C6A66A]/40 text-xs font-medium text-[#F3E7D1] inline-flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#C6A66A]" />
                <span>Masayı Temizle</span>
              </button>
            )}
          </div>
        </div>

        {/* Shuffling Animation Overlay / Deck Visualization */}
        <AnimatePresence mode="wait">
          {isShufflingAnim && (
            <motion.div
              key="shuffle-anim"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-8 flex flex-col items-center justify-center space-y-4"
              data-testid="shuffle-animation-stage"
            >
              <div className="relative w-36 h-44 flex items-center justify-center">
                {[0, 1, 2, 3, 4, 5].map((idx) => (
                  <motion.div
                    key={idx}
                    className="absolute w-24 h-40 rounded-xl tarot-card-back border-2 border-[#C6A66A] shadow-card flex items-center justify-center"
                    animate={{
                      x: [0, (idx % 2 === 0 ? -1 : 1) * (28 + idx * 4), 0],
                      y: [0, (idx % 2 === 0 ? -6 : 6), 0],
                      rotate: [0, (idx % 2 === 0 ? -12 : 12), 0],
                    }}
                    transition={{
                      duration: 0.55,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <Sparkles className="w-6 h-6 text-[#C6A66A]" />
                  </motion.div>
                ))}
              </div>
              <p className="text-sm font-serif text-[#C6A66A] tracking-wide">
                78 kart kriptografik Fisher–Yates algoritmasıyla karıştırılıyor...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Closed 78-Card Deck Ribbon (Idle or Selecting Phase) */}
        {!isShufflingAnim && !allInitialSelected && (
          <div
            className="rounded-xl bg-[#17141F]/65 border border-[#C6A66A]/35 p-3 sm:p-4 space-y-3"
            data-testid="closed-deck-area"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs sm:text-sm font-serif font-semibold text-[#C6A66A]">
                {session.phase === 'idle'
                  ? '78 Kartlık Kapalı Deste (Seçim için önce "Desteyi Karıştır" butonuna dokunun)'
                  : `Kapalı Desteden 3 Kart Seçin (${session.initialCards.length} / 3)`}
              </span>

              {session.phase === 'selecting' && (
                <button
                  type="button"
                  onClick={() => onSelectCardFromDeck(0)}
                  data-testid="quick-pick-card-btn"
                  className="min-h-[44px] px-3.5 py-1.5 rounded-lg bg-[#622F48] hover:bg-[#773957] border border-[#C6A66A]/60 text-xs font-semibold text-[#F3E7D1] inline-flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C6A66A]" />
                  <span>
                    {session.initialCards.length + 1}. Kartı Desteden Çek
                  </span>
                </button>
              )}
            </div>

            {/* Interactive 78-Card Closed Spread */}
            <div
              className="grid grid-cols-13 sm:grid-cols-16 md:grid-cols-20 gap-1 sm:gap-1.5 py-1"
              style={{
                gridTemplateColumns: 'repeat(auto-fill, minmax(26px, 1fr))',
              }}
              data-testid="deck-cards-grid"
            >
              {session.shuffledDeckIds.map((cardId, idx) => {
                const isInteractive = session.phase === 'selecting';
                return (
                  <motion.button
                    key={cardId}
                    type="button"
                    disabled={!isInteractive}
                    onClick={() => onSelectCardFromDeck(idx)}
                    whileHover={
                      animationsEnabled && isInteractive ? { y: -4, scale: 1.06 } : undefined
                    }
                    whileTap={
                      animationsEnabled && isInteractive ? { scale: 0.95 } : undefined
                    }
                    aria-label={`Desteden ${idx + 1}. kapalı kartı seç`}
                    data-testid={`deck-card-${idx}`}
                    className={`aspect-[10/17] w-full rounded-md tarot-card-back border transition-all flex items-center justify-center ${
                      isInteractive
                        ? 'border-[#C6A66A]/75 hover:border-[#C6A66A] cursor-pointer shadow-sm'
                        : 'border-[#C6A66A]/30 opacity-75 cursor-not-allowed'
                    }`}
                  >
                    <span className="text-[8px] text-[#C6A66A]/80">✦</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Main Three-Card Spread Row (Always 3 Equal Columns on Mobile & Desktop!) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xs sm:text-sm font-serif font-semibold uppercase tracking-wider text-[#C6A66A]">
              Üç Kart Açılım Masası (
              {SPREAD_DEFINITIONS[session.spreadType]?.nameTr})
            </h3>
            <span className="text-[11px] text-[#F3E7D1]/70">
              {revealedInitialCards.length}/3 Açıldı
            </span>
          </div>

          <div
            className="three-card-spread-grid gap-2 sm:gap-4 items-start pt-1"
            data-testid="three-card-spread-row"
          >
            {[0, 1, 2].map((slotIndex) => {
              const drawn = session.initialCards[slotIndex];
              const slotTitle =
                SPREAD_DEFINITIONS[session.spreadType]?.positions[slotIndex] ||
                `${slotIndex + 1}. Kart`;

              if (!drawn) {
                return (
                  <div
                    key={`empty-slot-${slotIndex}`}
                    data-testid={`empty-spread-slot-${slotIndex}`}
                    className="flex flex-col items-center w-full min-w-0"
                  >
                    <div className="w-full mb-1.5 px-1 text-center min-w-0">
                      <span className="inline-block max-w-full truncate text-[11px] sm:text-xs font-medium uppercase text-[#C6A66A]/70 bg-[#17141F]/60 border border-[#C6A66A]/20 rounded-full px-2 py-0.5">
                        {slotTitle}
                      </span>
                    </div>
                    <div className="w-full aspect-[10/17] rounded-xl border-2 border-dashed border-[#C6A66A]/30 bg-[#17141F]/40 flex flex-col items-center justify-center p-2 text-center">
                      <span className="text-base sm:text-xl font-serif text-[#C6A66A]/45">
                        {slotIndex + 1}
                      </span>
                      <span className="text-[10px] sm:text-xs text-[#F3E7D1]/45 mt-1 leading-tight">
                        {session.phase === 'idle' ? 'Deste Hazır' : 'Kart Seçin'}
                      </span>
                    </div>
                  </div>
                );
              }

              return (
                <TarotCardView
                  key={drawn.instanceId}
                  drawnCard={drawn}
                  animationsEnabled={animationsEnabled}
                  onReveal={onRevealCard}
                  onInspect={onInspectCard}
                  testIdPrefix="initial-card"
                />
              );
            })}
          </div>
        </div>

        {/* 4. Extra Cards Section ("Bir Kart Daha Çek") */}
        {allInitialSelected && (
          <div
            className="pt-4 border-t border-[#C6A66A]/25 space-y-3"
            data-testid="extra-cards-section"
          >
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <div>
                <h3 className="text-sm sm:text-base font-serif font-bold text-[#F3E7D1] flex items-center gap-1.5">
                  <PlusCircle className="w-4 h-4 text-[#C6A66A]" />
                  Ek Kartlar ({session.extraCards.length})
                </h3>
                <p className="text-[11px] sm:text-xs text-[#F3E7D1]/70">
                  İlk üç kart sabit kalır; kalan desteden tek tek kapalı ek kart çekip ayrı ayrı açabilirsiniz.
                </p>
              </div>

              <button
                type="button"
                disabled={remainingDeckCount === 0}
                onClick={onDrawExtraCard}
                data-testid="draw-extra-card-btn"
                className={`min-h-[44px] px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm inline-flex items-center gap-2 transition-all ${
                  remainingDeckCount > 0
                    ? 'bg-[#622F48] hover:bg-[#7b3b5a] text-[#F3E7D1] border border-[#C6A66A]'
                    : 'bg-[#17141F]/60 text-[#F3E7D1]/40 border border-[#C6A66A]/20 cursor-not-allowed'
                }`}
              >
                <PlusCircle className="w-4 h-4 text-[#C6A66A]" />
                <span>
                  {remainingDeckCount > 0
                    ? `Bir Kart Daha Çek (${remainingDeckCount} Kaldı)`
                    : 'Destede Kart Kalmadı (0)'}
                </span>
              </button>
            </div>

            {session.extraCards.length > 0 && (
              <div
                className="extra-cards-grid gap-3 pt-1"
                data-testid="extra-cards-grid"
              >
                {session.extraCards.map((extra, idx) => (
                  <div
                    key={extra.instanceId}
                    className="rounded-xl bg-[#17141F]/70 border border-[#C6A66A]/30 p-2.5 flex flex-col justify-between space-y-2 min-w-0"
                    data-testid={`extra-card-container-${idx}`}
                  >
                    <TarotCardView
                      drawnCard={extra}
                      animationsEnabled={animationsEnabled}
                      onReveal={onRevealCard}
                      onInspect={onInspectCard}
                      testIdPrefix="extra-card"
                    />

                    {/* Per-Extra-Card Inline Note Input */}
                    {extra.isRevealed && (
                      <div className="pt-1 border-t border-[#C6A66A]/20 space-y-1">
                        <label
                          htmlFor={`extra-note-${extra.instanceId}`}
                          className="text-[10px] font-medium text-[#C6A66A] flex items-center gap-1"
                        >
                          <PenLine className="w-3 h-3" />
                          {extra.positionTitle} Notu
                        </label>
                        <input
                          id={`extra-note-${extra.instanceId}`}
                          type="text"
                          maxLength={300}
                          value={extra.userNote || ''}
                          onChange={(e) =>
                            onUpdateCardNote(extra.instanceId, e.target.value)
                          }
                          data-testid={`extra-card-note-input-${idx}`}
                          placeholder="Bu ek kart için kısa not..."
                          className="w-full min-h-[40px] rounded-lg bg-[#302139]/70 border border-[#C6A66A]/35 px-2.5 py-1.5 text-xs text-[#F3E7D1] placeholder-[#F3E7D1]/40 focus:outline-none focus:border-[#C6A66A]"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. Action Bar: Gemini Interpretation & Save Reading */}
        {allInitialSelected && (
          <div className="pt-3 border-t border-[#C6A66A]/25 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <label
                htmlFor="general-reading-notes"
                className="text-xs font-medium text-[#C6A66A] block mb-1"
              >
                Genel Açılım Notunuz (İsteğe Bağlı)
              </label>
              <input
                id="general-reading-notes"
                type="text"
                maxLength={500}
                value={session.generalNotes}
                onChange={(e) => onUpdateGeneralNotes(e.target.value)}
                data-testid="general-notes-input"
                placeholder="Sezgisel izlenimlerinizi veya okuma notunuzu buraya ekleyebilirsiniz..."
                className="w-full min-h-[44px] rounded-xl bg-[#17141F]/90 border border-[#C6A66A]/35 px-3 py-2 text-xs sm:text-sm text-[#F3E7D1] placeholder-[#F3E7D1]/40 focus:outline-none focus:border-[#C6A66A]"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={onSaveReading}
                data-testid="save-reading-btn"
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#302139] hover:bg-[#622F48]/80 border border-[#C6A66A]/50 text-xs sm:text-sm font-medium text-[#F3E7D1] inline-flex items-center justify-center gap-1.5 transition-colors"
              >
                <BookmarkCheck className="w-4 h-4 text-[#C6A66A]" />
                <span>
                  {session.isSavedToHistory ? 'Geçmişte Kayıtlı' : 'Açılımı Kaydet'}
                </span>
              </button>

              <button
                type="button"
                disabled={!allInitialRevealed || isInterpreting}
                onClick={onRequestGeminiInterpret}
                data-testid="interpret-with-gemini-btn"
                className={`min-h-[44px] px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition-all ${
                  allInitialRevealed && !isInterpreting
                    ? 'bg-[#C6A66A] hover:bg-[#d6b77c] text-[#17141F] shadow-gold cursor-pointer'
                    : 'bg-[#302139]/60 text-[#F3E7D1]/45 border border-[#C6A66A]/20 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {isInterpreting
                    ? 'Gemini Yorumluyor...'
                    : 'Gemini ile Yorumla'}
                </span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 6. Inline Classical Meanings Summary of Revealed Cards (Works 100% Offline!) */}
      {revealedInitialCards.length > 0 && (
        <section
          aria-label="Açılan Kartların Klasik Anlamları"
          data-testid="classical-meanings-panel"
          className="rounded-2xl bg-[#302139]/65 border border-[#C6A66A]/35 p-4 sm:p-5 space-y-3"
        >
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm sm:text-base font-serif font-bold text-[#C6A66A] flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Açılan Kartların Klasik Rider–Waite Anlamları
            </h3>
            <span className="text-[11px] text-[#F3E7D1]/65">
              Çevrimdışı Hazır
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              ...session.initialCards.filter((c) => c.isRevealed),
              ...session.extraCards.filter((c) => c.isRevealed),
            ].map((dc) => (
              <div
                key={dc.instanceId}
                data-testid={`classical-card-summary-${dc.positionIndex}`}
                className="rounded-xl bg-[#17141F]/85 border border-[#C6A66A]/30 p-3.5 space-y-2 flex flex-col justify-between min-w-0"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C6A66A]">
                      {dc.positionTitle}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        dc.isReversed
                          ? 'bg-[#622F48] text-[#F3E7D1]'
                          : 'bg-[#302139] text-[#C6A66A]'
                      }`}
                    >
                      {dc.isReversed ? 'Ters' : 'Düz'}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#F3E7D1]">
                    {dc.card.nameTr}
                  </h4>
                  <p className="text-xs leading-relaxed text-[#F3E7D1]/90 safe-text-wrap">
                    {dc.isReversed
                      ? dc.card.reversedMeaning
                      : dc.card.uprightMeaning}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#C6A66A]/15 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1 min-w-0">
                    {dc.card.keywords.slice(0, 3).map((kw) => (
                      <span
                        key={kw}
                        className="text-[10px] px-2 py-0.5 rounded bg-[#302139] text-[#C6A66A]"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => onInspectCard(dc)}
                    className="min-h-[44px] px-2.5 py-1 rounded-lg text-xs font-medium text-[#C6A66A] hover:bg-[#302139] shrink-0"
                  >
                    Büyüt →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
