import React from 'react';
import { GameCategory, Platform } from '../types';
import { Search, Flame, Filter, SlidersHorizontal, Layers } from 'lucide-react';

interface GameFilterProps {
  selectedGame: GameCategory | 'الكل';
  setSelectedGame: (game: GameCategory | 'الكل') => void;
  selectedPlatform: Platform | 'الكل';
  setSelectedPlatform: (platform: Platform | 'الكل') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  priceSort: 'all' | 'low_high' | 'high_low';
  setPriceSort: (sort: 'all' | 'low_high' | 'high_low') => void;
}

const GAME_CATEGORIES: (GameCategory | 'الكل')[] = [
  'الكل',
  'eFootball (بيس)',
  'eFootball Mobile',
  'eFootball PC/Console',
  'حسابات بيس خارقة',
  'حسابات ايبك ونادرة',
  'حسابات بيس اقتصادية'
];

export const GameFilter: React.FC<GameFilterProps> = ({
  selectedGame,
  setSelectedGame,
  selectedPlatform,
  setSelectedPlatform,
  searchQuery,
  setSearchQuery,
  priceSort,
  setPriceSort
}) => {
  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 mb-8 shadow-xl">
      
      {/* Top Search & Controls Row */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
        
        {/* Search Bar */}
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن حساب بيس، ميسي 105، نيمار، رومينيغه، قوة الفريق..."
            className="w-full bg-white/5 border border-white/10 focus:border-cyan-400/80 rounded-xl pr-11 pl-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none transition backdrop-blur-md shadow-inner"
          />
          <Search className="w-5 h-5 text-white/50 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Platform & Price Sort Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          
          {/* Platform Selector */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white/80 backdrop-blur-md">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="text-white/50 font-semibold">المنصة:</span>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value as Platform | 'الكل')}
              className="bg-transparent text-white focus:outline-none font-bold cursor-pointer"
            >
              <option value="الكل" className="bg-slate-900 text-white">جميع المنصات</option>
              <option value="Mobile" className="bg-slate-900 text-white">موبايل (Mobile)</option>
              <option value="PC" className="bg-slate-900 text-white">كمبيوتر (PC)</option>
              <option value="Console" className="bg-slate-900 text-white">بلايستيشن / إكس بوكس</option>
              <option value="Cross-Platform" className="bg-slate-900 text-white">مشترك (Cross-Platform)</option>
            </select>
          </div>

          {/* Price Sorting */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white/80 backdrop-blur-md">
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            <span className="text-white/50 font-semibold">السعر:</span>
            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value as 'all' | 'low_high' | 'high_low')}
              className="bg-transparent text-white focus:outline-none font-bold cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-white">الافتراضي</option>
              <option value="low_high" className="bg-slate-900 text-white">من الأقل إلى الأعلى سعر</option>
              <option value="high_low" className="bg-slate-900 text-white">من الأعلى إلى الأقل سعر</option>
            </select>
          </div>

        </div>

      </div>

      {/* Category Pills Slider */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Flame className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-white/80">اختر اللعبة المفضلة:</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {GAME_CATEGORIES.map((cat) => {
            const isSelected = selectedGame === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedGame(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 backdrop-blur-md border ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-400 shadow-md shadow-cyan-500/15'
                    : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border-white/10'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
