import React, { useState } from 'react';
import { PaymentMethod } from '../types';
import { useStore } from '../context/StoreContext';
import { PAYMENT_PHONE } from '../data/initialData';
import { X, Copy, Check, Upload, Image, Wallet, Smartphone, ShieldCheck, HelpCircle, ArrowLeft, Send } from 'lucide-react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose }) => {
  const { submitDeposit, showToast } = useStore();

  const [method, setMethod] = useState<PaymentMethod>('zain_cash');
  const [amountIqd, setAmountIqd] = useState<number>(25000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [senderPhone, setSenderPhone] = useState<string>('');
  const [proofImageUrl, setProofImageUrl] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(PAYMENT_PHONE);
    setCopied(true);
    showToast('تم نسخ الرقم', `تم نسخ الرقم ${PAYMENT_PHONE} إلى الحافظة بنجاح`, 'info');
    setTimeout(() => setCopied(false), 2500);
  };

  // Convert uploaded image file to Data URL
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('حجم الملف كبير', 'يرجى اختيار صورة بحجم أقل من 5 ميجابايت', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProofImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalAmount = customAmount ? parseInt(customAmount, 10) : amountIqd;

    if (!finalAmount || finalAmount < 5000) {
      showToast('المبلغ غير كافٍ', 'أدنى مبلغ للشحن هو 5,000 دينار عراقي', 'error');
      return;
    }

    if (!senderPhone || senderPhone.trim().length < 8) {
      showToast('رقم المحول مطلوب', 'يرجى كتابة رقم الهاتف أو كود التحويل الذي قمت بالتحويل منه', 'error');
      return;
    }

    if (!proofImageUrl) {
      showToast('صورة الإثبات مطلوبة', 'يرجى رفع صورة وصل التحويل أو اختيار صورة إثبات لتأكيد عملية الدفع', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      await submitDeposit(method, finalAmount, senderPhone, proofImageUrl, notes);
      setIsSubmitting(false);
      onClose();
      // Reset form
      setSenderPhone('');
      setProofImageUrl('');
      setNotes('');
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      <div className="relative backdrop-blur-2xl bg-slate-900/90 border border-white/10 rounded-3xl max-w-2xl w-full my-auto overflow-hidden shadow-2xl text-right">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-white/5 border-b border-white/10 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">شحن محفظتك بـ زين كاش / اسياسيل</h3>
              <p className="text-xs text-white/60">تحويل سريع وإضافة الرصيد فور التأكد من الإثبات</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/60 hover:text-white p-2 rounded-xl hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* STEP 1: PAYMENT METHOD SELECTOR */}
          <div>
            <label className="text-xs font-bold text-white/80 block mb-2">1. اختر طريقة الدفع والتحويل:</label>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              
              {/* Zain Cash */}
              <button
                type="button"
                onClick={() => setMethod('zain_cash')}
                className={`p-3.5 rounded-2xl border text-right transition flex flex-col justify-between backdrop-blur-md ${
                  method === 'zain_cash'
                    ? 'bg-rose-500/20 border-rose-500/60 text-white shadow-lg shadow-rose-500/10'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/70'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-sm text-rose-400">زين كاش</span>
                  <Smartphone className="w-4 h-4 text-rose-400" />
                </div>
                <span className="text-[11px] text-white/60 leading-tight">تحويل من تطبيق زين كاش مباشرة</span>
              </button>

              {/* Asiacell Balance Transfer */}
              <button
                type="button"
                onClick={() => setMethod('asiacell_transfer')}
                className={`p-3.5 rounded-2xl border text-right transition flex flex-col justify-between backdrop-blur-md ${
                  method === 'asiacell_transfer'
                    ? 'bg-amber-500/20 border-amber-500/60 text-white shadow-lg shadow-amber-500/10'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/70'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-sm text-amber-300">اسياسيل تحويل</span>
                  <Smartphone className="w-4 h-4 text-amber-300" />
                </div>
                <span className="text-[11px] text-white/60 leading-tight">تحويل رصيد اسياسيل لرقمنا</span>
              </button>

              {/* Asiacell Recharge Card */}
              <button
                type="button"
                onClick={() => setMethod('asiacell_card')}
                className={`p-3.5 rounded-2xl border text-right transition flex flex-col justify-between backdrop-blur-md ${
                  method === 'asiacell_card'
                    ? 'bg-cyan-500/20 border-cyan-500/60 text-white shadow-lg shadow-cyan-500/10'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/70'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-sm text-cyan-400">اسياسيل كارت</span>
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-[11px] text-white/60 leading-tight">شحن بكارت رصيد اسياسيل</span>
              </button>

            </div>
          </div>

          {/* STEP 2: DISPLAY TARGET PHONE NUMBER (CRITICAL USER REQUIREMENT) */}
          <div className="backdrop-blur-xl bg-white/5 border-2 border-cyan-400/40 p-4 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-cyan-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                الرقم المعتمد للتحويل (زين كاش واسياسيل):
              </span>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-bold px-2 py-0.5 rounded-full border border-cyan-500/30">
                رقم المتجر المباشر
              </span>
            </div>

            <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10 dir-ltr backdrop-blur-md">
              <span className="text-xl sm:text-2xl font-black text-cyan-400 font-mono tracking-widest">
                {PAYMENT_PHONE}
              </span>

              <button
                type="button"
                onClick={handleCopyPhone}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition shadow-lg shadow-cyan-500/20"
              >
                {copied ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'تم النسخ!' : 'نسخ الرقم'}</span>
              </button>
            </div>

            <p className="text-[11px] text-white/70 mt-2.5 leading-relaxed">
              * قم بتحويل المبلغ المطلوب لــ <strong className="text-cyan-400 font-mono dir-ltr inline-block bg-white/10 px-1.5 py-0.5 rounded border border-white/10">{PAYMENT_PHONE}</strong> عبر تطبيق زين كاش أو تحويل رصيد اسياسيل، ثم احتفظ بصورة من الوصل أو شاشة التحويل.
            </p>
          </div>

          {/* STEP 3: AMOUNT SELECTION */}
          <div>
            <label className="text-xs font-bold text-white/80 block mb-2">2. اختر أو اكتب مبلغ التحويل بالدينار العراقي:</label>
            
            <div className="grid grid-cols-4 gap-2 mb-3">
              {[15000, 25000, 50000, 100000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setAmountIqd(amt);
                    setCustomAmount('');
                  }}
                  className={`py-2 rounded-xl text-xs font-extrabold transition font-mono backdrop-blur-md ${
                    amountIqd === amt && !customAmount
                      ? 'bg-cyan-500 text-slate-900 font-black shadow-lg shadow-cyan-500/20'
                      : 'bg-white/5 text-white/80 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {amt.toLocaleString('ar-IQ')} د.ع
                </button>
              ))}
            </div>

            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="أو اكتب مبلغ آخر هنا (مثال: 75000)"
              className="w-full bg-white/5 border border-white/10 focus:border-cyan-400/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none transition font-mono backdrop-blur-md"
            />
          </div>

          {/* STEP 4: SENDER PHONE / CODE */}
          <div>
            <label className="text-xs font-bold text-white/80 block mb-1">3. رقم هاتف المحول منه أو كود الكارت:</label>
            <input
              type="text"
              value={senderPhone}
              onChange={(e) => setSenderPhone(e.target.value)}
              placeholder="اكتب رقمك الذي قمت بالتحويل منه (مثال: 07701234567)"
              className="w-full bg-white/5 border border-white/10 focus:border-cyan-400/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none transition font-mono dir-ltr text-right backdrop-blur-md"
              required
            />
          </div>

          {/* STEP 5: PROOF IMAGE UPLOAD (CRITICAL REQUIREMENT) */}
          <div>
            <label className="text-xs font-bold text-white/80 block mb-1">
              4. ارفع صورة إثبات الدفع / سكرين شوت التحويل:
            </label>

            {proofImageUrl ? (
              <div className="relative rounded-2xl overflow-hidden border-2 border-cyan-400/60 bg-white/5 max-h-52 flex items-center justify-center p-2 group backdrop-blur-md">
                <img src={proofImageUrl} alt="إثبات الدفع" className="max-h-48 object-contain rounded-xl" />
                <button
                  type="button"
                  onClick={() => setProofImageUrl('')}
                  className="absolute top-3 left-3 bg-rose-600 hover:bg-rose-500 text-white text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-lg"
                >
                  <X className="w-3.5 h-3.5" /> إلغاء وتغيير الصورة
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 hover:border-cyan-400/60 bg-white/5 rounded-2xl p-6 cursor-pointer transition group backdrop-blur-md">
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-white mb-0.5">اضغط هنا لاختيار صورة الوصل / الشاشة</span>
                <span className="text-[11px] text-white/50">يدعم PNG, JPG, JPEG</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Notes Optional */}
          <div>
            <label className="text-xs font-semibold text-white/60 block mb-1">ملاحظات إضافية للأدمن (اختياري):</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثلاً: تحويل زين كاش لشراء حساب ببجي"
              className="w-full bg-white/5 border border-white/10 focus:border-cyan-400/80 rounded-xl px-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none transition backdrop-blur-md"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-3 border-t border-white/10">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-extrabold py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition shadow-xl shadow-cyan-500/25 disabled:opacity-50"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
              <span>{isSubmitting ? 'جاري الإرسال...' : 'إرسال إثبات التحويل للأدمن لإضافة الرصيد'}</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
