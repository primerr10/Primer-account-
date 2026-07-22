import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PAYMENT_PHONE, ADMIN_EMAIL } from '../data/initialData';
import { Gamepad2, Wallet, Plus, ShieldAlert, ShoppingBag, ShieldCheck, UserCheck, ChevronDown, Check, LogOut, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenDeposit: () => void;
  onOpenOrders: () => void;
  onOpenAdmin: () => void;
  activeTab: 'store' | 'admin';
  setActiveTab: (tab: 'store' | 'admin') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDeposit,
  onOpenOrders,
  onOpenAdmin,
  activeTab,
  setActiveTab
}) => {
  const { currentUser, isAdmin, orders, switchUserRole, loginWithGoogle, logout } = useStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const deliveredOrdersCount = orders.filter(o => o.userId === currentUser.id && o.status === 'delivered').length;

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/5 border-b border-white/10 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('store')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-xl shadow-lg shadow-cyan-500/20 text-slate-900 shrink-0">
              P
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  متجر برايمر <span className="text-cyan-400">للحسابات</span>
                </h1>
                {isAdmin && (
                  <span className="hidden sm:inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] px-2.5 py-0.5 rounded-full font-semibold backdrop-blur-md">
                    <ShieldCheck className="w-3 h-3" /> أدمن
                  </span>
                )}
              </div>
              <p className="text-xs text-white/60 font-medium hidden sm:block">
                زين كاش واسياسيل ({PAYMENT_PHONE})
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Wallet Balance Badge */}
            <div className="flex items-center bg-white/10 border border-white/5 backdrop-blur-md rounded-full p-1.5 sm:px-4 sm:py-2">
              <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
                <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Wallet className="w-3.5 h-3.5" />
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-white/60 block leading-none">الرصيد الحالي:</span>
                  <span className="text-xs sm:text-sm font-bold text-cyan-400 font-mono dir-ltr">
                    {currentUser.walletBalanceIqd.toLocaleString('ar-IQ')} <span className="text-[10px] text-white/70">د.ع</span>
                  </span>
                </div>
              </div>

              {/* Deposit Button */}
              <button
                onClick={onOpenDeposit}
                className="mr-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors shadow-lg shadow-cyan-500/20 shrink-0"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span className="hidden xs:inline">شحن الرصيد</span>
              </button>
            </div>

            {/* My Purchased Accounts Vault Button */}
            <button
              onClick={onOpenOrders}
              className="relative backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs sm:text-sm font-medium px-3.5 py-2 rounded-lg flex items-center gap-2 transition-colors"
              title="سجل المشتريات"
            >
              <ShoppingBag className="w-4 h-4 text-cyan-400" />
              <span className="hidden md:inline">سجل المشتريات</span>
              {deliveredOrdersCount > 0 && (
                <span className="bg-cyan-400 text-slate-900 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                  {deliveredOrdersCount}
                </span>
              )}
            </button>

            {/* Admin Dashboard Toggle Button */}
            {isAdmin && (
              <button
                onClick={() => {
                  onOpenAdmin();
                  setActiveTab('admin');
                }}
                className={`relative px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors border ${
                  activeTab === 'admin'
                    ? 'bg-amber-400 text-slate-900 border-amber-300 shadow-lg shadow-amber-500/20'
                    : 'backdrop-blur-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/30'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>لوحة الأدمن</span>
              </button>
            )}

            {/* User Account / Google Sign In Button & Menu */}
            <div className="relative">
              {!currentUser.isGoogleUser ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={loginWithGoogle}
                    className="backdrop-blur-md bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-2 transition shadow-lg shrink-0"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span className="hidden sm:inline">تسجيل الدخول بـ Google</span>
                    <span className="sm:hidden">جوجل</span>
                  </button>

                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="p-2 backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl transition"
                    title="قائمة الحسابات"
                  >
                    <ChevronDown className="w-4 h-4 text-white/70" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 backdrop-blur-md bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-white text-xs p-1.5 sm:px-3 sm:py-2 rounded-xl transition-colors"
                >
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt={currentUser.name} className="w-6 h-6 rounded-full object-cover border border-cyan-400" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-cyan-400 text-slate-900 flex items-center justify-center font-bold text-xs">
                      {currentUser.name.charAt(0)}
                    </div>
                  )}
                  <div className="text-right hidden lg:block">
                    <span className="text-xs font-semibold block line-clamp-1">{currentUser.name}</span>
                    <span className="text-[10px] text-cyan-300 block line-clamp-1">حساب Google</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              )}

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute left-0 mt-2 w-72 backdrop-blur-2xl bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl p-3 z-50 text-right animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-3 bg-white/5 rounded-xl mb-2 border border-white/5">
                    <div className="flex items-center gap-2 mb-1">
                      {currentUser.photoURL && (
                        <img src={currentUser.photoURL} alt="" className="w-7 h-7 rounded-full object-cover border border-cyan-400" />
                      )}
                      <div>
                        <p className="text-xs font-bold text-white">{currentUser.name}</p>
                        <p className="text-[11px] text-white/60 font-mono dir-ltr truncate">{currentUser.email}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isAdmin ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      }`}>
                        {isAdmin ? 'مدير الموقع (الأدمن)' : 'زبون متسوق'}
                      </span>
                      {currentUser.isGoogleUser && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                          Google Auth
                        </span>
                      )}
                    </div>
                  </div>

                  {currentUser.isGoogleUser ? (
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full mb-3 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold p-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>تسجيل الخروج من Google</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        loginWithGoogle();
                        setShowUserMenu(false);
                      }}
                      className="w-full mb-3 bg-white text-slate-900 font-bold p-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <span>تسجيل الدخول بـ Google</span>
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};

