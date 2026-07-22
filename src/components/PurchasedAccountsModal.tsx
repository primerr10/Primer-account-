import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Copy, Check, Lock, ShieldCheck, Key, ShoppingBag, Mail, AlertTriangle, Sparkles, PhoneCall } from 'lucide-react';

interface PurchasedAccountsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PurchasedAccountsModal: React.FC<PurchasedAccountsModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, orders, showToast } = useStore();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const myOrders = orders.filter(o => o.userId === currentUser.id || o.userEmail === currentUser.email);

  const copyToClipboard = (text: string, label: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    showToast('تم النسخ', `تم نسخ ${label} إلى الحافظة بنجاح`, 'info');
    setTimeout(() => setCopiedField(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      <div className="relative backdrop-blur-2xl bg-slate-900/90 border border-white/10 rounded-3xl max-w-3xl w-full my-auto overflow-hidden shadow-2xl text-right">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-white/5 border-b border-white/10 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">خزنة حساباتي المشتراة</h3>
              <p className="text-xs text-white/60">معلومات ومعاملات الحسابات الخاصة بك بآمان تام</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/60 hover:text-white p-2 rounded-xl hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {myOrders.length === 0 ? (
            <div className="text-center py-12 px-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
              <ShoppingBag className="w-12 h-12 text-white/30 mx-auto mb-3" />
              <h4 className="text-base font-bold text-white mb-1">لم تقم بشراء أي حساب بعد</h4>
              <p className="text-xs text-white/60 max-w-sm mx-auto">
                تصفح قائمة الحسابات المتوفرة في المتجر، وعند الشراء ستظهر لك معلومات تسجيل الدخول فوراً هنا.
              </p>
            </div>
          ) : (
            myOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 text-right relative overflow-hidden backdrop-blur-md"
              >
                {/* Status bar top */}
                <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="bg-cyan-500/20 text-cyan-300 text-xs font-bold px-2.5 py-0.5 rounded-lg border border-cyan-500/30">
                      {order.game}
                    </span>
                    <span className="text-xs text-white/60 font-mono">
                      تاريخ الشراء: {new Date(order.createdAt).toLocaleDateString('ar-IQ')}
                    </span>
                  </div>

                  <span className={`text-xs font-extrabold px-2.5 py-1 rounded-xl flex items-center gap-1 backdrop-blur-md ${
                    order.status === 'delivered'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {order.status === 'delivered' ? (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5" /> تم التسليم بنجاح
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" /> قيد جهوزية التسليم
                      </>
                    )}
                  </span>
                </div>

                {/* Account Title & Price */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <h4 className="text-sm sm:text-base font-bold text-white">{order.accountTitle}</h4>
                  <span className="text-sm font-extrabold text-cyan-400 font-mono dir-ltr shrink-0">
                    {order.priceIqd.toLocaleString('ar-IQ')} د.ع
                  </span>
                </div>

                {/* Admin Contact Transfer Notice */}
                <div className="mb-4 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center gap-3 backdrop-blur-md">
                  <PhoneCall className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
                  <p className="text-xs text-amber-200/90 leading-relaxed">
                    <strong className="text-amber-300 font-bold block">متابعة عملية نقل الحساب:</strong>
                    سوف يتواصل معك الأدمن مباشرة عبر الهاتف أو الواتساب لنقل ملكية الحساب لك وتأكيد بيانات الدخول الخاصة به.
                  </p>
                </div>

                {/* Credentials Details Box */}
                {order.credentials ? (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 backdrop-blur-md">
                    <div className="flex items-center justify-between text-xs text-white/60 pb-2 border-b border-white/10">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Key className="w-4 h-4 text-cyan-400" /> معلومات الحساب الخاصة بك:
                      </span>
                      <span className="text-[10px] text-amber-300 font-semibold">حصرية لك فقط</span>
                    </div>

                    {/* Login ID / Email */}
                    <div className="flex items-center justify-between bg-white/5 p-2.5 rounded-lg border border-white/10">
                      <div className="text-right">
                        <span className="text-[10px] text-white/50 block">الإيميل / اسم المستخدم:</span>
                        <span className="text-xs font-mono font-bold text-cyan-300 dir-ltr block">
                          {order.credentials.loginId}
                        </span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(order.credentials!.loginId, 'الإيميل', `${order.id}-id`)}
                        className="bg-white/10 hover:bg-white/20 text-white border border-white/10 text-xs px-2.5 py-1.5 rounded-md flex items-center gap-1 transition"
                      >
                        {copiedField === `${order.id}-id` ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>نسخ</span>
                      </button>
                    </div>

                    {/* Password */}
                    <div className="flex items-center justify-between bg-white/5 p-2.5 rounded-lg border border-white/10">
                      <div className="text-right">
                        <span className="text-[10px] text-white/50 block">كلمة السر (Password):</span>
                        <span className="text-xs font-mono font-bold text-emerald-400 dir-ltr block">
                          {order.credentials.password}
                        </span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(order.credentials!.password, 'كلمة السر', `${order.id}-pass`)}
                        className="bg-white/10 hover:bg-white/20 text-white border border-white/10 text-xs px-2.5 py-1.5 rounded-md flex items-center gap-1 transition"
                      >
                        {copiedField === `${order.id}-pass` ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>نسخ</span>
                      </button>
                    </div>

                    {/* Security Code / Instructions */}
                    {order.credentials.secCode && (
                      <div className="flex items-center justify-between bg-white/5 p-2.5 rounded-lg border border-white/10">
                        <div className="text-right">
                          <span className="text-[10px] text-white/50 block">رمز الأمان / الكود الإضافي:</span>
                          <span className="text-xs font-mono font-bold text-amber-300 dir-ltr block">
                            {order.credentials.secCode}
                          </span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(order.credentials!.secCode!, 'رمز الأمان', `${order.id}-code`)}
                          className="bg-white/10 hover:bg-white/20 text-white border border-white/10 text-xs px-2.5 py-1.5 rounded-md flex items-center gap-1 transition"
                        >
                          {copiedField === `${order.id}-code` ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>نسخ</span>
                        </button>
                      </div>
                    )}

                    {order.credentials.instructions && (
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2.5 text-xs text-amber-200 leading-relaxed flex items-start gap-2 backdrop-blur-md">
                        <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-bold">تعليمات حماية الحساب:</strong>
                          <span>{order.credentials.instructions}</span>
                        </div>
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center backdrop-blur-md">
                    <p className="text-xs text-amber-300 font-bold mb-1">جاري تجهيز معلومات تسليم الحساب من قبل الأدمن</p>
                    <p className="text-[11px] text-white/60">ستظهر معلومات الدخول هنا فور أن يقوم الأدمن بتوثيق العملية وتسليم التفاصيل.</p>
                  </div>
                )}

              </div>
            ))
          )}

        </div>

      </div>

    </div>
  );
};
