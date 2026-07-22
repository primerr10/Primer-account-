import React, { useState } from 'react';
import { GameAccount } from '../types';
import { useStore } from '../context/StoreContext';
import { X, ShieldCheck, Check, Sparkles, Wallet, Plus, ChevronRight, ChevronLeft, Lock, ArrowRight } from 'lucide-react';

interface AccountDetailModalProps {
  account: GameAccount | null;
  onClose: () => void;
  onOpenDeposit: () => void;
  onPurchaseSuccess?: (account: GameAccount) => void;
}

export const AccountDetailModal: React.FC<AccountDetailModalProps> = ({
  account,
  onClose,
  onOpenDeposit,
  onPurchaseSuccess
}) => {
  const { currentUser, buyAccount, deleteAccount, isAdmin, showToast } = useStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!account) return null;

  const images = account.images && account.images.length > 0
    ? account.images
    : ['https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80'];

  const hasEnoughBalance = currentUser.walletBalanceIqd >= account.priceIqd;

  const handleBuy = () => {
    const res = buyAccount(account.id);
    if (res.success) {
      onClose();
      if (onPurchaseSuccess) {
        onPurchaseSuccess(account);
      }
    }
  };

  const handleDeleteByAdmin = () => {
    if (confirm(`هل أنت متأكد من حذف الحساب "${account.title}" نهائياً من المتجر؟`)) {
      deleteAccount(account.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      <div className="relative backdrop-blur-2xl bg-slate-900/90 border border-white/10 rounded-3xl max-w-4xl w-full my-auto overflow-hidden shadow-2xl text-right">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-20 w-9 h-9 bg-slate-950/80 hover:bg-slate-950 text-white/70 hover:text-white rounded-full flex items-center justify-center border border-white/10 transition shadow-lg backdrop-blur-md"
          aria-label="إغلاق النافذة"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] overflow-y-auto">
          
          {/* Left / Top Image Gallery (7 Columns on large screens) */}
          <div className="lg:col-span-7 bg-slate-950/50 p-4 sm:p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-l border-white/10">
            
            {/* Main Featured Image */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video mb-4 border border-white/10 group">
              <img
                src={images[selectedImageIndex]}
                alt={account.title}
                className="w-full h-full object-cover"
              />
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center"
                    aria-label="الصورة السابقة"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex((prev) => (prev + 1) % images.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center"
                    aria-label="الصورة التالية"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails row */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                      selectedImageIndex === idx ? 'border-cyan-400 scale-105 shadow-md shadow-cyan-500/20' : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Guarantee Badge */}
            <div className="mt-4 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center gap-3 text-cyan-300 text-xs backdrop-blur-md">
              <ShieldCheck className="w-6 h-6 text-cyan-400 shrink-0" />
              <div>
                <span className="font-bold block">ضمان الأمان ونقل الحساب 100%</span>
                <span className="text-white/60 text-[11px]">
                  عند إكمال الشراء، يتواصل معك الأدمن مباشرة عبر الواتساب/الهاتف لنقل كامل بيانات ومعلومات الحساب لك.
                </span>
              </div>
            </div>

          </div>

          {/* Right Content / Purchase Panel (5 Columns on large screens) */}
          <div className="lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between">
            
            <div>
              {/* Category & Status Header */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold px-3 py-1 rounded-xl backdrop-blur-md">
                  {account.game}
                </span>
                <span className="text-xs text-white/60 font-semibold">
                  الربط: <span className="text-amber-300 font-bold">{account.loginType}</span>
                </span>
              </div>

              {/* Account Title */}
              <h2 className="text-lg sm:text-xl font-extrabold text-white mb-3 leading-snug">
                {account.title}
              </h2>

              {/* Price Banner */}
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 mb-5 backdrop-blur-md">
                <span className="text-xs text-white/50 block mb-1">السعر النهائي للحساب:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono dir-ltr">
                    {account.priceIqd.toLocaleString('ar-IQ')}
                  </span>
                  <span className="text-sm font-bold text-cyan-400">دينار عراقي</span>
                  <span className="text-xs text-white/40 font-mono">(${account.priceUsd})</span>
                </div>
              </div>

              {/* Specifications Grid */}
              <div className="space-y-3 mb-5">
                <h4 className="text-xs font-bold text-white/60 uppercase tracking-wider">مواصفات الحساب:</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {account.level > 0 && (
                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 backdrop-blur-md">
                      <span className="text-white/50 block text-[10px]">المستوى (Level)</span>
                      <span className="font-extrabold text-amber-300 text-sm">لفل {account.level}</span>
                    </div>
                  )}
                  {account.rank && (
                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 backdrop-blur-md">
                      <span className="text-white/50 block text-[10px]">الرتبة / التقييم</span>
                      <span className="font-extrabold text-cyan-400 text-sm">{account.rank}</span>
                    </div>
                  )}
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 backdrop-blur-md">
                    <span className="text-white/50 block text-[10px]">المنصة</span>
                    <span className="font-extrabold text-white/90 text-xs">{account.platform}</span>
                  </div>
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 backdrop-blur-md">
                    <span className="text-white/50 block text-[10px]">نوع الربط</span>
                    <span className="font-extrabold text-white/90 text-xs">{account.loginType}</span>
                  </div>
                </div>
              </div>

              {/* Highlights & Description */}
              <div className="mb-6 space-y-3">
                <h4 className="text-xs font-bold text-white/60">مميزات وحشوات الحساب:</h4>
                <ul className="space-y-1.5">
                  {account.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-white/80">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-xs text-white/70 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/10 mt-3 backdrop-blur-md">
                  {account.description}
                </p>
              </div>
            </div>

            {/* Bottom Actions Area */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              
              {/* User Balance Check */}
              <div className="flex items-center justify-between text-xs bg-white/5 p-2.5 rounded-xl border border-white/10 backdrop-blur-md">
                <span className="text-white/60 flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-cyan-400" />
                  رصيد محفظتك الحالي:
                </span>
                <span className={`font-mono font-bold ${hasEnoughBalance ? 'text-cyan-400' : 'text-rose-400'}`}>
                  {currentUser.walletBalanceIqd.toLocaleString('ar-IQ')} د.ع
                </span>
              </div>

              {account.isAvailable ? (
                hasEnoughBalance ? (
                  <button
                    onClick={handleBuy}
                    className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-extrabold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-cyan-500/25"
                  >
                    <Check className="w-5 h-5 stroke-[3]" />
                    <span>تأكيد الشراء الفوري الآن</span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenDeposit();
                      }}
                      className="w-full backdrop-blur-md bg-white/10 hover:bg-white/20 text-cyan-400 border border-white/10 font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-cyan-500/10"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>شحن المحفظة بزين كاش / اسياسيل لشراء الحساب</span>
                    </button>
                    <p className="text-[11px] text-amber-300 text-center">
                      تحتاج شحن مبلغ {(account.priceIqd - currentUser.walletBalanceIqd).toLocaleString('ar-IQ')} د.ع إضافي لإكمال الشراء
                    </p>
                  </div>
                )
              ) : (
                <div className="p-3 bg-rose-500/20 border border-rose-500/30 rounded-xl text-center text-rose-300 text-xs font-bold">
                  عذراً، هذا الحساب مباع مسبقاً
                </div>
              )}

              {/* Admin Quick Action: Delete Account */}
              {isAdmin && (
                <button
                  onClick={handleDeleteByAdmin}
                  className="w-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 mt-2"
                >
                  <Lock className="w-3.5 h-3.5 text-rose-400" />
                  <span>حذف وإزالة الحساب من المتجر (خيار الأدمن)</span>
                </button>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
