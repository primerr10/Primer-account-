import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Gamepad2, Wallet, ShoppingBag, ShieldCheck, LogIn, LogOut, UserCheck, ShieldAlert, Sparkles, X } from 'lucide-react';
import { ADMIN_EMAIL } from '../data/initialData';

interface BottomNavProps {
  activeTab: 'store' | 'admin';
  setActiveTab: (tab: 'store' | 'admin') => void;
  onOpenDeposit: () => void;
  onOpenOrders: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenDeposit,
  onOpenOrders,
}) => {
  const { currentUser, isAdmin, orders, loginWithGoogle, logout, switchUserRole } = useStore();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const deliveredOrdersCount = orders.filter(o => o.userId === currentUser.id && o.status === 'delivered').length;

  return (
    <>
      {/* APP-LIKE BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-2xl bg-slate-900/90 border-t border-white/10 px-2 py-2 shadow-[0_-8px_30px_rgba(0,0,0,0.6)] sm:hidden">
        <div className="max-w-md mx-auto flex items-center justify-around">
          
          {/* Store Tab */}
          <button
            onClick={() => setActiveTab('store')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all relative ${
              activeTab === 'store'
                ? 'text-cyan-400 font-extrabold bg-cyan-500/10 border border-cyan-500/20'
                : 'text-white/60 hover:text-white font-medium'
            }`}
          >
            <Gamepad2 className={`w-5 h-5 ${activeTab === 'store' ? 'text-cyan-400 scale-110' : ''} transition-transform`} />
            <span className="text-[10px] mt-0.5">المتجر</span>
          </button>

          {/* Deposit / Wallet Tab */}
          <button
            onClick={onOpenDeposit}
            className="flex flex-col items-center justify-center py-1 px-3 rounded-2xl text-white/70 hover:text-cyan-400 font-medium transition-all relative group"
          >
            <div className="relative">
              <Wallet className="w-5 h-5 group-hover:scale-110 transition-transform text-cyan-400" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <span className="text-[10px] mt-0.5">الشحن</span>
          </button>

          {/* My Orders Tab */}
          <button
            onClick={onOpenOrders}
            className="flex flex-col items-center justify-center py-1 px-3 rounded-2xl text-white/70 hover:text-cyan-400 font-medium transition-all relative"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 transition-transform" />
              {deliveredOrdersCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-cyan-400 text-slate-900 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {deliveredOrdersCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5">مشترياتي</span>
          </button>

          {/* Admin Dashboard Tab (If Admin) */}
          {isAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
                activeTab === 'admin'
                  ? 'text-amber-300 font-extrabold bg-amber-500/10 border border-amber-500/20'
                  : 'text-amber-400/80 hover:text-amber-300 font-medium'
              }`}
            >
              <ShieldCheck className={`w-5 h-5 ${activeTab === 'admin' ? 'scale-110 text-amber-300' : ''}`} />
              <span className="text-[10px] mt-0.5">الأدمن</span>
            </button>
          )}

          {/* Account / Google Auth Tab */}
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-2 rounded-2xl text-white/70 hover:text-white font-medium transition-all"
          >
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.name}
                className="w-5 h-5 rounded-full border border-cyan-400 object-cover"
              />
            ) : currentUser.isGoogleUser ? (
              <div className="w-5 h-5 rounded-full bg-cyan-400 text-slate-900 flex items-center justify-center font-bold text-[10px]">
                {currentUser.name.charAt(0)}
              </div>
            ) : (
              <LogIn className="w-5 h-5 text-cyan-400" />
            )}
            <span className="text-[10px] mt-0.5">
              {currentUser.isGoogleUser ? 'حسابي' : 'دخول'}
            </span>
          </button>

        </div>
      </nav>

      {/* MOBILE PROFILE & GOOGLE AUTH MODAL */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 text-right shadow-2xl backdrop-blur-2xl animate-in slide-in-from-bottom duration-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{currentUser.name}</h3>
                  <p className="text-[11px] text-white/60 font-mono dir-ltr">{currentUser.email}</p>
                </div>
              </div>

              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="p-1 text-white/60 hover:text-white rounded-full bg-white/5 border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Balance */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4 backdrop-blur-md flex items-center justify-between">
              <div>
                <span className="text-xs text-white/60 block mb-0.5">رصيد محفظتك الحالي:</span>
                <span className="text-lg font-black text-cyan-400 font-mono dir-ltr">
                  {currentUser.walletBalanceIqd.toLocaleString('ar-IQ')} د.ع
                </span>
              </div>
              <button
                onClick={() => {
                  setIsProfileModalOpen(false);
                  onOpenDeposit();
                }}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 text-xs font-extrabold px-3.5 py-2 rounded-xl transition shadow-lg shadow-cyan-500/20"
              >
                + شحن
              </button>
            </div>

            {/* Google Login / Logout Action */}
            <div className="space-y-3 mb-4">
              {currentUser.isGoogleUser ? (
                <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-cyan-400" /> مسجل دخول بـ Google
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                      نشط
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsProfileModalOpen(false);
                    }}
                    className="w-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>تسجيل الخروج من Google</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={async () => {
                    await loginWithGoogle();
                    setIsProfileModalOpen(false);
                  }}
                  className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-3 transition shadow-lg"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>تسجيل الدخول المباشر بـ Google</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
};
