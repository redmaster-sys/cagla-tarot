import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Sparkles, RotateCcw } from 'lucide-react';
import { DrawnCard } from '../types/tarot';
import { resolveCardImageUrl } from '../data/tarotDeck';

interface TarotCardViewProps {
  drawnCard: DrawnCard;
  animationsEnabled: boolean;
  onReveal: (instanceId: string) => void;
  onInspect: (drawnCard: DrawnCard) => void;
  compact?: boolean;
  testIdPrefix?: string;
}

export const TarotCardView: React.FC<TarotCardViewProps> = ({
  drawnCard,
  animationsEnabled,
  onReveal,
  onInspect,
  compact = false,
  testIdPrefix = 'spread-card',
}) => {
  const { instanceId, card, positionTitle, isReversed, isRevealed, positionIndex } =
    drawnCard;

  const handleCardActivation = () => {
    if (!isRevealed) {
      onReveal(instanceId);
    } else {
      onInspect(drawnCard);
    }
  };

  return (
    <div
      className="flex flex-col items-center w-full min-w-0 select-none"
      data-testid={`${testIdPrefix}-slot-${positionIndex}`}
    >
      {/* Position Header Badge */}
      <div className="w-full mb-1.5 px-1 text-center min-w-0">
        <span
          className="inline-block max-w-full truncate text-[11px] sm:text-xs font-medium tracking-wide uppercase text-[#C6A66A] bg-[#17141F]/80 border border-[#C6A66A]/30 rounded-full px-2 py-0.5"
          title={positionTitle}
          data-testid={`${testIdPrefix}-position-${positionIndex}`}
        >
          {positionTitle}
        </span>
      </div>

      {/* 3D Flip Card Button */}
      <button
        type="button"
        onClick={handleCardActivation}
        aria-label={
          isRevealed
            ? `${positionTitle}: ${card.nameTr} (${
                isReversed ? 'Ters' : 'Düz'
              }) — Detayları görüntüle`
            : `${positionTitle} kartını çevir ve aç`
        }
        data-testid={`${testIdPrefix}-button-${positionIndex}`}
        data-card-id={card.id}
        data-revealed={isRevealed ? 'true' : 'false'}
        data-reversed={isReversed ? 'true' : 'false'}
        className="group relative w-full min-w-0 min-h-[44px] aspect-[10/17] perspective-1000 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A66A] rounded-xl cursor-pointer"
      >
        <motion.div
          className="w-full h-full relative preserve-3d rounded-xl"
          initial={false}
          animate={{ rotateY: isRevealed ? 180 : 0 }}
          transition={
            animationsEnabled
              ? { duration: 0.65, ease: [0.22, 1, 0.36, 1] }
              : { duration: 0.01 }
          }
        >
          {/* CARD BACK (Face Down) */}
          <div
            className="absolute inset-0 w-full h-full backface-hidden rounded-xl tarot-card-back border-2 border-[#C6A66A]/70 shadow-card p-1.5 sm:p-2 flex flex-col items-center justify-between overflow-hidden group-hover:border-[#C6A66A] transition-colors"
            style={{ WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
          >
            <div className="w-full h-full rounded-lg border border-[#C6A66A]/40 flex flex-col items-center justify-center relative p-1">
              {/* Corner Celestial Ornaments */}
              <span className="absolute top-1 left-1.5 text-[10px] text-[#C6A66A]/70">✦</span>
              <span className="absolute top-1 right-1.5 text-[10px] text-[#C6A66A]/70">✦</span>
              <span className="absolute bottom-1 left-1.5 text-[10px] text-[#C6A66A]/70">✦</span>
              <span className="absolute bottom-1 right-1.5 text-[10px] text-[#C6A66A]/70">✦</span>

              {/* Mystic Mandala Emblem */}
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border border-[#C6A66A]/60 bg-[#17141F]/70 flex items-center justify-center shadow-gold">
                <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-[#C6A66A]" />
              </div>

              <span className="mt-2 text-[10px] sm:text-xs font-serif tracking-wider text-[#F3E7D1]/90 text-center px-1 leading-tight">
                Açmak İçin Dokun
              </span>
            </div>
          </div>

          {/* CARD FRONT (Revealed) */}
          <div
            className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-xl bg-[#17141F] border-2 border-[#C6A66A] shadow-card overflow-hidden flex flex-col justify-between p-1 sm:p-1.5"
            style={{
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="relative w-full h-full bg-[#F3E7D1]/5 rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={resolveCardImageUrl(card.image)}
                alt={`${card.nameTr} (${card.nameEn})`}
                loading="eager"
                className={`w-full h-full object-contain transition-transform ${
                  isReversed ? 'rotate-180' : ''
                }`}
              />
              {isReversed && (
                <span
                  className="absolute top-1 right-1 bg-[#622F48]/95 text-[#F3E7D1] border border-[#C6A66A]/60 text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded shadow"
                  title="Ters Kart"
                >
                  Ters
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </button>

      {/* Card Label & Quick Meaning Trigger */}
      <div className="w-full mt-1.5 text-center min-w-0 px-0.5">
        {isRevealed ? (
          <div className="flex flex-col items-center min-w-0">
            <p
              className="w-full truncate font-serif font-semibold text-xs sm:text-sm md:text-base text-[#F3E7D1]"
              title={card.nameTr}
              data-testid={`${testIdPrefix}-name-${positionIndex}`}
            >
              {card.nameTr}
            </p>
            <div className="flex items-center justify-center gap-1 mt-0.5 flex-wrap">
              <span
                className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded font-medium ${
                  isReversed
                    ? 'bg-[#622F48]/70 text-[#F3E7D1] border border-[#C6A66A]/40'
                    : 'bg-[#302139] text-[#C6A66A] border border-[#C6A66A]/30'
                }`}
              >
                {isReversed ? (
                  <span className="inline-flex items-center gap-0.5">
                    <RotateCcw className="w-2.5 h-2.5" /> Ters
                  </span>
                ) : (
                  'Düz'
                )}
              </span>
            </div>
            {!compact && (
              <button
                type="button"
                onClick={() => onInspect(drawnCard)}
                data-testid={`${testIdPrefix}-inspect-${positionIndex}`}
                className="mt-1.5 inline-flex items-center justify-center gap-1 min-h-[44px] w-full px-2 py-1.5 rounded-lg bg-[#302139]/90 hover:bg-[#622F48]/80 border border-[#C6A66A]/35 text-[11px] sm:text-xs font-medium text-[#F3E7D1] transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-[#C6A66A] shrink-0" />
                <span className="truncate">Klasik Anlam</span>
              </button>
            )}
          </div>
        ) : (
          <p className="text-[11px] sm:text-xs text-[#F3E7D1]/60 italic truncate py-1">
            Kapalı Kart
          </p>
        )}
      </div>
    </div>
  );
};
