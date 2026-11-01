import React, { useState, useMemo } from 'react';
import { Search, BookOpen, Filter } from 'lucide-react';
import { TAROT_DECK, resolveCardImageUrl } from '../data/tarotDeck';
import { TarotCard } from '../types/tarot';

interface CardLibraryScreenProps {
  onSelectCard: (card: TarotCard) => void;
}

type LibraryFilter = 'all' | 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';

const FILTER_TABS: Array<{ id: LibraryFilter; label: string; count: number }> = [
  { id: 'all', label: 'Tümü', count: 78 },
  { id: 'major', label: 'Büyük Arkana', count: 22 },
  { id: 'wands', label: 'Değnekler', count: 14 },
  { id: 'cups', label: 'Kupalar', count: 14 },
  { id: 'swords', label: 'Kılıçlar', count: 14 },
  { id: 'pentacles', label: 'Tılsımlar', count: 14 },
];

export const CardLibraryScreen: React.FC<CardLibraryScreenProps> = ({
  onSelectCard,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<LibraryFilter>('all');

  const filteredCards = useMemo(() => {
    const q = searchQuery.trim().toLocaleLowerCase('tr-TR');
    return TAROT_DECK.filter((card) => {
      if (activeFilter === 'major' && card.arcana !== 'major') return false;
      if (
        activeFilter !== 'all' &&
        activeFilter !== 'major' &&
        card.suit !== activeFilter
      ) {
        return false;
      }

      if (!q) return true;
      const inTr = card.nameTr.toLocaleLowerCase('tr-TR').includes(q);
      const inEn = card.nameEn.toLowerCase().includes(q);
      const inKw = card.keywords.some((k) =>
        k.toLocaleLowerCase('tr-TR').includes(q)
      );
      const inMeaning =
        card.uprightMeaning.toLocaleLowerCase('tr-TR').includes(q) ||
        card.symbolicDescription.toLocaleLowerCase('tr-TR').includes(q);

      return inTr || inEn || inKw || inMeaning;
    });
  }, [searchQuery, activeFilter]);

  return (
    <div
      className="w-full max-w-5xl mx-auto space-y-4 min-w-0"
      data-testid="card-library-screen"
    >
      {/* Search & Filter Header */}
      <section className="rounded-2xl bg-[#302139]/75 border border-[#C6A66A]/40 p-4 sm:p-5 space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#F3E7D1] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#C6A66A]" />
              Rider–Waite–Smith Kart Kütüphanesi (78 Kart)
            </h2>
            <p className="text-xs text-[#C6A66A]/90 mt-0.5">
              1909 Pamela Colman Smith orijinal kamu malı çizimleri, düz/ters anlamlar ve sembolik rehber.
            </p>
          </div>
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full bg-[#17141F] border border-[#C6A66A]/40 text-[#C6A66A]"
            data-testid="library-card-count"
          >
            Gösterilen: {filteredCards.length} / 78
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#C6A66A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="library-search-input"
            placeholder="Kart adı, sembol veya anahtar kelime ara (örn: Yıldız, Kupa Ası, sezgi, dönüşüm)..."
            className="w-full min-h-[44px] rounded-xl bg-[#17141F] border border-[#C6A66A]/40 pl-10 pr-4 py-2.5 text-sm text-[#F3E7D1] placeholder-[#F3E7D1]/40 focus:outline-none focus:border-[#C6A66A]"
          />
        </div>

        {/* Suit / Arcana Filter Pills */}
        <div
          className="flex items-center gap-1.5 flex-wrap"
          role="tablist"
          aria-label="Arkana ve Takım Filtresi"
        >
          <Filter className="w-3.5 h-3.5 text-[#C6A66A] mr-1 hidden sm:inline" />
          {FILTER_TABS.map((tab) => {
            const isSelected = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                data-testid={`library-filter-${tab.id}`}
                onClick={() => setActiveFilter(tab.id)}
                className={`min-h-[44px] px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-[#622F48] border-[#C6A66A] text-[#F3E7D1]'
                    : 'bg-[#17141F]/80 border-[#C6A66A]/25 text-[#F3E7D1]/80 hover:border-[#C6A66A]/60'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            );
          })}
        </div>
      </section>

      {/* Cards Responsive Grid */}
      <section
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 min-w-0"
        data-testid="library-cards-grid"
      >
        {filteredCards.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectCard(card)}
            data-testid={`library-card-${card.id}`}
            className="group rounded-xl bg-[#302139]/65 hover:bg-[#622F48]/50 border border-[#C6A66A]/35 hover:border-[#C6A66A] p-2.5 flex flex-col items-center text-center transition-all min-w-0"
          >
            <div className="w-full aspect-[10/17] rounded-lg bg-[#17141F] border border-[#C6A66A]/45 p-1 overflow-hidden flex items-center justify-center">
              <img
                src={resolveCardImageUrl(card.image)}
                alt={`${card.nameTr} (${card.nameEn})`}
                loading="lazy"
                className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform"
              />
            </div>
            <div className="w-full mt-2 min-w-0">
              <p className="text-[10px] text-[#C6A66A] truncate">
                {card.suitLabelTr} • {card.romanOrRank}
              </p>
              <h3 className="font-serif font-bold text-xs sm:text-sm text-[#F3E7D1] truncate mt-0.5">
                {card.nameTr}
              </h3>
              <p className="text-[10px] text-[#F3E7D1]/60 truncate">
                {card.nameEn}
              </p>
            </div>
          </button>
        ))}
      </section>
    </div>
  );
};
