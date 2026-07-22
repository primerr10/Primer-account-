import React from 'react';
import { GameAccount } from '../types';
import { CheckCircle2, PhoneCall, ShieldCheck, ShoppingBag, X } from 'lucide-react';

interface PurchaseSuccessModalProps {
  account: GameAccount | null;
  onClose: () => void;
  onOpenMyOrders: () => void;
}

export const PurchaseSuccessModal: React.FC<PurchaseSuccessModalProps> = ({
  account,
  onClose,
  onOpenMyOrders,
}) => {
  if (!account) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative backdrop-blur-2xl bg-slate-900/95 border border-cyan-500/30 rounded-3xl max-w-lg w-full p-6 text-right shadow-2xl shadow-cyan-500/10">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-white/60 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-black text-white text-center mb-1">
          تمت عملية الشراء بنجاح! 🎉
        </h3>
        <p className="text-xs text-white/60 text-center mb-6">
          تم خصم المبلغ وتأكيد طلبك بنجاح في النظام
        </p>

        {/* Purchased Account Brief Box */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <img
              src={account.images?.[0] || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80'}
              alt={account.title}
              className="w-16 h-16 rounded-xl object-cover border border-white/10"
            />
            <div className="flex-1">
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-bold px-2 py-0.5 rounded-md border border-cyan-500/30">
                {account.game}
              </span>
              <h4 className="text-sm font-bold text-white mt-1 line-clamp-1">{account.title}</h4>
              <span className="text-xs font-black text-cyan-400 font-mono mt-0.5 block">
                {account.priceIqd.toLocaleString('ar-IQ')} دينار عراقي
              </span>
            </div>
          </div>
        </div>

        {/* Prominent Transfer Notice Banner (Requested) */}
        <div className="bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-amber-500/20 border border-amber-500/40 rounded-2xl p-4 mb-6 backdrop-blur-md">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/30 border border-amber-500/50 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h5 className="text-sm font-extrabold text-amber-300 mb-1">
                تنويه هام بشأن تحويل الحساب:
              </h5>
              <p className="text-xs text-amber-100/90 leading-relaxed font-semibold">
                سوف يتواصل معك <span className="text-amber-300 underline font-extrabold">الأدمن</span> مباشرة عبر رقم الهاتف أو الواتساب لنقل ملكية الحساب لك وتأكيد كافة البيانات والربط الخاص به بكل أمان وسلاسة.
              </p>
            </div>
          </div>
        </div>

        {/* Safety Guarantee */}
        <div className="flex items-center justify-center gap-2 text-xs text-white/50 mb-6 font-semibold">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>ضمان سلامة ونقل الحساب 100% من قبل إدارة الموقع</span>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={() => {
              onClose();
              onOpenMyOrders();
            }}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-cyan-500/20"
          >
            <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
            <span>عرض الحساب في "حساباتي المشتراة"</span>
          </button>

          <button
            onClick={onClose}
            className="w-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white font-bold py-2.5 rounded-xl text-xs transition border border-white/10"
          >
            العودة للتصفح المتجر
          </button>
        </div>

      </div>
    </div>
  );
};
