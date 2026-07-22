import React, { useState } from 'react';
import { GameAccount } from '../types';
import { useStore } from '../context/StoreContext';
import { Image, ShieldCheck, Zap, ChevronLeft, ChevronRight, Eye, ShoppingCart, Check, Trash2 } from 'lucide-react';

interface AccountCardProps {
  account: GameAccount;
  onSelect: (account: GameAccount) => void;
  onQuickBuy: (account: GameAccount) => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({ account, onSelect, onQuickBuy }) => {
  const { isAdmin, deleteAccount } = useStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = account.images && account.images.length > 0
    ? account.images
    : ['https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80'];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      onClick={() => onSelect(account)}
      className="group backdrop-blur-xl bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-white/[0.08] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col cursor-pointer relative"
    >
      
      {/* Image & Badges Banner */}
      <div className="relative h-52 sm:h-56 bg-slate-950/50 overflow-hidden">
        <img
          src={images[currentImageIndex]}
          alt={account.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Dark gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/40" />

        {/* Top Badges */}
        <div className="absolute top-3 right-3 left-3 flex items-center justify-between pointer-events-none">
          <span className="bg-slate-950/70 backdrop-blur-md border border-white/10 text-cyan-400 text-xs font-bold px-2.5 py-1 rounded-lg">
            {account.game}
          </span>

          <div className="flex items-center gap-1.5">
            {account.level > 0 && (
              <span className="bg-amber-400 text-slate-900 font-black text-[11px] px-2 py-0.5 rounded-lg shadow">
                لفل {account.level}
              </span>
            )}
            {!account.isAvailable && (
              <span className="bg-rose-600 text-white font-extrabold text-[11px] px-2 py-0.5 rounded-lg shadow">
                تم البيع
              </span>
            )}
          </div>
        </div>

        {/* Image Controls if multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              aria-label="الصورة السابقة"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              aria-label="الصورة التالية"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Photos count badge */}
            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-white/80 text-[11px] px-2 py-0.5 rounded-md flex items-center gap-1">
              <Image className="w-3 h-3 text-cyan-400" />
              <span>{currentImageIndex + 1} / {images.length} صور</span>
            </div>
          </>
        )}

        {/* Rank badge bottom right */}
        {account.rank && (
          <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 text-cyan-300 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>{account.rank}</span>
          </div>
        )}
      </div>

      {/* Account Info Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        
        <div>
          {/* Title */}
          <h3 className="text-sm sm:text-base font-bold text-white mb-2 leading-snug group-hover:text-cyan-300 transition line-clamp-2">
            {account.title}
          </h3>

          {/* Highlights Pills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {account.highlights.slice(0, 3).map((hl, idx) => (
              <span
                key={idx}
                className="bg-white/10 text-white/80 text-[11px] px-2.5 py-0.5 rounded-lg border border-white/5 backdrop-blur-md"
              >
                {hl}
              </span>
            ))}
            {account.highlights.length > 3 && (
              <span className="text-[10px] text-white/50 self-center">
                +{account.highlights.length - 3} المزيد
              </span>
            )}
          </div>
        </div>

        {/* Footer: Platform & Price & Buy Action */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between mt-auto">
          
          {/* Price */}
          <div>
            <span className="text-[10px] text-white/50 block font-semibold">السعر الحالي:</span>
            <div className="flex items-baseline gap-1">
              <span className="text-base sm:text-lg font-extrabold text-cyan-400 font-mono dir-ltr">
                {account.priceIqd.toLocaleString('ar-IQ')}
              </span>
              <span className="text-xs font-bold text-cyan-400">د.ع</span>
            </div>
            <span className="text-[10px] text-white/40 block font-mono">(${account.priceUsd})</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            {isAdmin && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`هل أنت متأكد من حذف الحساب "${account.title}" من المتجر؟`)) {
                    deleteAccount(account.id);
                  }
                }}
                className="p-2 bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/30 rounded-xl transition"
                title="حذف الحساب (أدمن)"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(account);
              }}
              className="bg-white/10 hover:bg-white/20 text-white p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/10 backdrop-blur-md"
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">التفاصيل</span>
            </button>

            {account.isAvailable ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickBuy(account);
                }}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-cyan-500/20"
              >
                <ShoppingCart className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>شراء</span>
              </button>
            ) : (
              <button
                disabled
                className="bg-white/5 text-white/40 font-bold px-3 py-2 rounded-xl text-xs cursor-not-allowed border border-white/5"
              >
                مبيوع
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
