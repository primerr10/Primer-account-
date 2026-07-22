import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ADMIN_EMAIL } from '../data/initialData';
import { X, Mail, ShieldCheck, UserCheck, AlertCircle, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { loginWithGoogle, loginWithCustomEmail, showToast } = useStore();
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await loginWithGoogle();
      if (res && res.error) {
        setAuthError(res.error);
      } else {
        onClose();
      }
    } catch (e: any) {
      setAuthError(e.message || 'حدث خطأ أثناء الاتصال بجوجل');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      showToast('خطأ', 'يرجى إدخال البريد الإلكتروني', 'error');
      return;
    }

    loginWithCustomEmail(emailInput.trim(), nameInput.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative backdrop-blur-2xl bg-slate-900/95 border border-cyan-500/30 rounded-3xl max-w-md w-full p-6 text-right shadow-2xl shadow-cyan-500/10">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-white/60 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title & Icon */}
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mb-3">
          <Mail className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-black text-white mb-1">
          تسجيل الدخول في المتجر
        </h3>
        <p className="text-xs text-white/60 mb-6">
          اختر طريقة تسجيل الدخول المفضل لديك لحفظ رصيدك ومشترياتك
        </p>

        {/* Auth Error Banner if Vercel / Domain error occurs */}
        {authError && (
          <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-200 text-xs leading-relaxed space-y-1 backdrop-blur-md">
            <div className="flex items-center gap-2 text-rose-300 font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>تنويه حول تسجيل الدخول عبر Vercel / GitHub:</span>
            </div>
            <p className="text-[11px] text-rose-100/90">{authError}</p>
            <p className="text-[10px] text-cyan-300 pt-1 font-semibold">
              💡 يمكنك استخدام "تسجيل الدخول المباشر بالبريد" أدناه للدخول فوراً دون الحاجة لإعدادات Vercel.
            </p>
          </div>
        )}

        {/* Option 1: Google Sign In */}
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full mb-4 bg-white hover:bg-slate-100 text-slate-900 font-extrabold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-3 transition shadow-lg shadow-white/10 border border-white disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>{isLoading ? 'جاري الاتصال بجوجل...' : 'تسجيل الدخول المباشر بحساب Google'}</span>
        </button>

        <div className="relative flex items-center my-5">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink mx-3 text-[11px] text-white/40 font-bold">أو عبر البريد الإلكتروني (بديل Vercel)</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        {/* Option 2: Custom Email Login Form */}
        <form onSubmit={handleCustomLogin} className="space-y-3">
          <div>
            <label className="text-xs font-bold text-white/80 block mb-1">البريد الإلكتروني:</label>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder={`أدخل إيميلك (أو أدمن: ${ADMIN_EMAIL})`}
              className="w-full bg-white/5 border border-white/10 focus:border-cyan-400 rounded-xl p-3 text-xs text-white dir-ltr text-right placeholder-white/30 focus:outline-none transition"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-white/80 block mb-1">الاسم الكامل (اختياري):</label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="مثال: أحمد العراقي"
              className="w-full bg-white/5 border border-white/10 focus:border-cyan-400 rounded-xl p-3 text-xs text-white placeholder-white/30 focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-cyan-500/20 mt-2"
          >
            <UserCheck className="w-4 h-4 stroke-[2.5]" />
            <span>دخول الحساب الفوري</span>
          </button>
        </form>

        <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/5 text-[11px] text-white/50 flex items-center justify-between">
          <span>دخول الأدمن المعلن:</span>
          <button
            type="button"
            onClick={() => {
              setEmailInput(ADMIN_EMAIL);
              setNameInput('أدمن الموقع الرئيسي');
            }}
            className="text-amber-300 font-bold underline hover:text-amber-200 dir-ltr font-mono"
          >
            {ADMIN_EMAIL}
          </button>
        </div>

      </div>
    </div>
  );
};
