import React from 'react';
import {
  History,
  Trash2,
  FolderOpen,
  Sparkles,
  Calendar,
  Layers,
} from 'lucide-react';
import { ReadingSession, SPREAD_DEFINITIONS } from '../types/tarot';
import { resolveCardImageUrl } from '../data/tarotDeck';

interface HistoryScreenProps {
  readings: ReadingSession[];
  onOpenReading: (reading: ReadingSession) => void;
  onDeleteReading: (id: string) => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  readings,
  onOpenReading,
  onDeleteReading,
}) => {
  return (
    <div
      className="w-full max-w-4xl mx-auto space-y-4 min-w-0"
      data-testid="history-screen"
    >
      <section className="rounded-2xl bg-[#302139]/75 border border-[#C6A66A]/40 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg sm:text-xl font-serif font-bold text-[#F3E7D1] flex items-center gap-2">
            <History className="w-5 h-5 text-[#C6A66A]" />
            Kaydedilmiş Geçmiş Açılımlar
          </h2>
          <p className="text-xs text-[#C6A66A]/90 mt-0.5">
            Cihazınızda saklanan geçmiş tarot okumalarını, kartlarını ve notlarınızı tekrar açıp inceleyebilirsiniz.
          </p>
        </div>
        <span
          className="text-xs font-semibold px-3 py-1 rounded-full bg-[#17141F] border border-[#C6A66A]/40 text-[#C6A66A]"
          data-testid="history-count-badge"
        >
          Toplam: {readings.length} Açılım
        </span>
      </section>

      {readings.length === 0 ? (
        <div
          className="rounded-2xl bg-[#302139]/45 border border-[#C6A66A]/25 p-8 text-center space-y-2"
          data-testid="history-empty-state"
        >
          <Layers className="w-8 h-8 text-[#C6A66A]/60 mx-auto" />
          <h3 className="text-base font-serif font-bold text-[#F3E7D1]">
            Henüz Kaydedilmiş Bir Açılım Yok
          </h3>
          <p className="text-xs sm:text-sm text-[#F3E7D1]/70 max-w-md mx-auto">
            Tarot Masası&apos;nda üç kart seçtikten sonra &ldquo;Açılımı Kaydet&rdquo;
            butonuna dokunarak okumalarınızı buraya kaydedebilirsiniz.
          </p>
        </div>
      ) : (
        <div className="space-y-3" data-testid="history-list">
          {readings.map((reading) => {
            const spreadName =
              SPREAD_DEFINITIONS[reading.spreadType]?.nameTr || reading.spreadType;
            const formattedDate = new Date(reading.createdAt).toLocaleString('tr-TR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <article
                key={reading.id}
                data-testid={`history-item-${reading.id}`}
                className="rounded-2xl bg-[#302139]/70 border border-[#C6A66A]/35 p-4 sm:p-5 space-y-3.5"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#C6A66A]">
                        {spreadName}
                      </span>
                      <span className="text-xs text-[#F3E7D1]/65 inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {formattedDate}
                      </span>
                      {reading.geminiInterpretation && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#622F48] border border-[#C6A66A]/50 text-[#F3E7D1] inline-flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-[#C6A66A]" /> Yorumlu
                        </span>
                      )}
                    </div>

                    {reading.question && (
                      <p className="text-xs sm:text-sm text-[#F3E7D1] font-medium safe-text-wrap">
                        Soru: “{reading.question}”
                      </p>
                    )}
                    {reading.generalNotes && (
                      <p className="text-xs text-[#F3E7D1]/75 italic safe-text-wrap">
                        Not: {reading.generalNotes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onOpenReading(reading)}
                      data-testid={`open-history-${reading.id}`}
                      className="min-h-[44px] px-4 py-2 rounded-xl bg-[#C6A66A] hover:bg-[#d5b77d] text-[#17141F] font-semibold text-xs inline-flex items-center gap-1.5 transition-colors"
                    >
                      <FolderOpen className="w-4 h-4" />
                      <span>Tekrar Aç</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteReading(reading.id)}
                      aria-label="Açılımı Sil"
                      data-testid={`delete-history-${reading.id}`}
                      className="min-h-[44px] min-w-[44px] p-2 rounded-xl bg-[#17141F] hover:bg-[#622F48] border border-[#C6A66A]/35 text-[#F3E7D1] inline-flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-[#C6A66A]" />
                    </button>
                  </div>
                </div>

                {/* Cards Preview Strip */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {[...reading.initialCards, ...reading.extraCards].map((dc) => (
                    <div
                      key={dc.instanceId}
                      className="flex items-center gap-2 rounded-xl bg-[#17141F]/80 border border-[#C6A66A]/30 px-2.5 py-1.5 shrink-0"
                    >
                      <div className="w-7 aspect-[10/17] rounded overflow-hidden border border-[#C6A66A]/40">
                        <img
                          src={resolveCardImageUrl(dc.card.image)}
                          alt={dc.card.nameTr}
                          className={`w-full h-full object-contain ${
                            dc.isReversed ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                      <div className="text-left">
                        <div className="text-[10px] text-[#C6A66A]">
                          {dc.positionTitle}
                        </div>
                        <div className="text-xs font-serif font-semibold text-[#F3E7D1]">
                          {dc.card.nameTr} ({dc.isReversed ? 'Ters' : 'Düz'})
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
