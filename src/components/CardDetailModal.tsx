import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Sparkles, BookOpen, Eye, PenLine, Check } from 'lucide-react';
import { DrawnCard, TarotCard } from '../types/tarot';
import { resolveCardImageUrl } from '../data/tarotDeck';

interface CardDetailModalProps {
  card: TarotCard | null;
  drawnCard?: DrawnCard | null;
  onClose: () => void;
  onSaveCardNote?: (instanceId: string, note: string) => void;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({
  card,
  drawnCard,
  onClose,
  onSaveCardNote,
}) => {
  const activeCard = drawnCard ? drawnCard.card : card;
  const isReversed = drawnCard ? drawnCard.isReversed : false;
  const [noteText, setNoteText] = useState(drawnCard?.userNote || '');
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    setNoteText(drawnCard?.userNote || '');
    setSavedNotice(false);
  }, [drawnCard, card]);

  if (!activeCard) return null;

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (drawnCard && onSaveCardNote) {
      onSaveCardNote(drawnCard.instanceId, noteText);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-card-title"
      data-testid="card-detail-modal"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90dvh] overflow-y-auto rounded-2xl bg-[#17141F] border-2 border-[#C6A66A]/70 shadow-2xl p-4 sm:p-6 text-[#F3E7D1]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="flex items-start justify-between gap-3 border-b border-[#C6A66A]/25 pb-3">
          <div className="min-w-0">
            {drawnCard && (
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#C6A66A] mb-1">
                {drawnCard.positionTitle}
              </span>
            )}
            <h2
              id="modal-card-title"
              className="text-xl sm:text-2xl font-serif font-bold text-[#F3E7D1] safe-text-wrap"
            >
              {activeCard.nameTr}
            </h2>
            <p className="text-xs sm:text-sm text-[#C6A66A]/90">
              {activeCard.nameEn} • {activeCard.suitLabelTr} ({activeCard.romanOrRank})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            data-testid="close-card-modal-btn"
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl bg-[#302139] hover:bg-[#622F48] border border-[#C6A66A]/40 text-[#F3E7D1] transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
          {/* Card Artwork Column */}
          <div className="sm:col-span-5 flex flex-col items-center">
            <div className="w-44 sm:w-full max-w-[220px] aspect-[10/17] rounded-xl bg-[#302139]/60 border-2 border-[#C6A66A] p-2 shadow-card flex items-center justify-center">
              <img
                src={resolveCardImageUrl(activeCard.image)}
                alt={`${activeCard.nameTr} (${activeCard.nameEn})`}
                className={`w-full h-full object-contain ${
                  isReversed ? 'rotate-180' : ''
                }`}
              />
            </div>

            {drawnCard && (
              <div className="mt-2.5">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                    isReversed
                      ? 'bg-[#622F48] text-[#F3E7D1] border-[#C6A66A]/60'
                      : 'bg-[#302139] text-[#C6A66A] border-[#C6A66A]/40'
                  }`}
                >
                  {isReversed ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5" /> Açılımda Ters Konumda
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" /> Açılımda Düz Konumda
                    </>
                  )}
                </span>
              </div>
            )}

            {/* Keywords */}
            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
              {activeCard.keywords.map((kw) => (
                <span
                  key={kw}
                  className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#302139] border border-[#C6A66A]/30 text-[#F3E7D1]/90"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Meanings & Symbolism Column */}
          <div className="sm:col-span-7 space-y-4 min-w-0">
            {/* Upright Meaning */}
            <div
              className={`p-3.5 rounded-xl border ${
                !isReversed
                  ? 'bg-[#302139]/90 border-[#C6A66A]'
                  : 'bg-[#302139]/40 border-[#C6A66A]/25'
              }`}
            >
              <h3 className="text-sm font-semibold text-[#C6A66A] flex items-center gap-1.5 mb-1">
                <Sparkles className="w-4 h-4 shrink-0" />
                Düz Anlamı {!isReversed && drawnCard ? '(Bu Açılımdaki Yönü)' : ''}
              </h3>
              <p className="text-sm leading-relaxed text-[#F3E7D1]/95 safe-text-wrap">
                {activeCard.uprightMeaning}
              </p>
            </div>

            {/* Reversed Meaning */}
            <div
              className={`p-3.5 rounded-xl border ${
                isReversed
                  ? 'bg-[#622F48]/50 border-[#C6A66A]'
                  : 'bg-[#302139]/40 border-[#C6A66A]/25'
              }`}
            >
              <h3 className="text-sm font-semibold text-[#C6A66A] flex items-center gap-1.5 mb-1">
                <RotateCcw className="w-4 h-4 shrink-0" />
                Ters Anlamı {isReversed && drawnCard ? '(Bu Açılımdaki Yönü)' : ''}
              </h3>
              <p className="text-sm leading-relaxed text-[#F3E7D1]/95 safe-text-wrap">
                {activeCard.reversedMeaning}
              </p>
            </div>

            {/* Symbolic Description */}
            <div className="p-3.5 rounded-xl bg-[#17141F] border border-[#C6A66A]/30">
              <h3 className="text-sm font-semibold text-[#C6A66A] flex items-center gap-1.5 mb-1">
                <Eye className="w-4 h-4 shrink-0" />
                1909 Rider–Waite–Smith Sembolizmi
              </h3>
              <p className="text-sm leading-relaxed text-[#F3E7D1]/90 safe-text-wrap">
                {activeCard.symbolicDescription}
              </p>
            </div>

            {/* Optional Note Editor when opened from a reading */}
            {drawnCard && onSaveCardNote && (
              <form
                onSubmit={handleSaveNote}
                className="p-3.5 rounded-xl bg-[#302139]/50 border border-[#C6A66A]/35 space-y-2"
              >
                <label
                  htmlFor="card-specific-note"
                  className="text-xs font-semibold text-[#C6A66A] flex items-center gap-1.5"
                >
                  <PenLine className="w-3.5 h-3.5" />
                  Bu Karta Özel Yorum Notunuz ({drawnCard.positionTitle})
                </label>
                <textarea
                  id="card-specific-note"
                  rows={2}
                  maxLength={400}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Bu kartın açılımdaki hissettirdiklerini veya önceki kartlarla bağını not edebilirsiniz..."
                  className="w-full rounded-lg bg-[#17141F] border border-[#C6A66A]/40 px-3 py-2 text-sm text-[#F3E7D1] placeholder-[#F3E7D1]/40 focus:outline-none focus:border-[#C6A66A]"
                />
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-[#F3E7D1]/60">
                    Notunuz kaydedilir ve dilerseniz Gemini yorumuna dahil edilir.
                  </span>
                  <button
                    type="submit"
                    data-testid="save-card-note-btn"
                    className="min-h-[44px] px-4 py-2 rounded-lg bg-[#C6A66A] hover:bg-[#d4b67d] text-[#17141F] font-semibold text-xs inline-flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    {savedNotice ? (
                      <>
                        <Check className="w-4 h-4" /> Kaydedildi
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-4 h-4" /> Notu Kaydet
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
