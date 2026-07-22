import React, { useState, useMemo } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { GameAccount, GameCategory, Platform } from './types';
import { PAYMENT_PHONE } from './data/initialData';
import { Header } from './components/Header';
import { GameFilter } from './components/GameFilter';
import { AccountCard } from './components/AccountCard';
import { AccountDetailModal } from './components/AccountDetailModal';
import { DepositModal } from './components/DepositModal';
import { PurchasedAccountsModal } from './components/PurchasedAccountsModal';
import { PurchaseSuccessModal } from './components/PurchaseSuccessModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { NotificationToast } from './components/NotificationToast';
import { Footer } from './components/Footer';
import { BottomNav } from './components/BottomNav';
import { ShieldCheck, Smartphone, Zap, Sparkles, Wallet, ShoppingBag, Gamepad2, SearchX, PlusCircle } from 'lucide-react';

function StoreMainContent() {
  const { accounts, buyAccount, isAdmin } = useStore();

  const [activeTab, setActiveTab] = useState<'store' | 'admin'>('store');
  const [selectedGame, setSelectedGame] = useState<GameCategory | 'الكل'>('الكل');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'الكل'>('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceSort, setPriceSort] = useState<'all' | 'low_high' | 'high_low'>('all');

  // Modals state
  const [selectedAccountModal, setSelectedAccountModal] = useState<GameAccount | null>(null);
  const [justPurchasedAccount, setJustPurchasedAccount] = useState<GameAccount | null>(null);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);

  // Filtered & Sorted Accounts
  const filteredAccounts = useMemo(() => {
    return accounts
      .filter((acc) => {
        const matchesGame = selectedGame === 'الكل' || acc.game === selectedGame;
        const matchesPlatform = selectedPlatform === 'الكل' || acc.platform === selectedPlatform;
        
        const q = searchQuery.trim().toLowerCase();
        const matchesSearch = !q || 
          acc.title.toLowerCase().includes(q) || 
          acc.game.toLowerCase().includes(q) ||
          acc.description.toLowerCase().includes(q) ||
          acc.highlights.some(h => h.toLowerCase().includes(q));

        return matchesGame && matchesPlatform && matchesSearch;
      })
      .sort((a, b) => {
        if (priceSort === 'low_high') return a.priceIqd - b.priceIqd;
        if (priceSort === 'high_low') return b.priceIqd - a.priceIqd;
        return 0; // Default order
      });
  }, [accounts, selectedGame, selectedPlatform, searchQuery, priceSort]);

  const handleQuickBuy = (acc: GameAccount) => {
    setSelectedAccountModal(acc);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-cyan-400 selection:text-slate-950 dir-rtl text-right relative overflow-x-hidden">
      
      {/* Ambient background glows for Frosted Glass theme */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[120px]"></div>
        <div className="absolute top-[40%] right-[20%] w-[35%] h-[35%] bg-cyan-600/30 rounded-full blur-[140px]"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Notification Toast */}
        <NotificationToast />

        {/* Navigation Bar */}
        <Header
          onOpenDeposit={() => setIsDepositModalOpen(true)}
          onOpenOrders={() => setIsOrdersModalOpen(true)}
          onOpenAdmin={() => setActiveTab('admin')}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 sm:pb-12 flex-1 w-full">
          
          {activeTab === 'admin' && isAdmin ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setActiveTab('store')}
                  className="backdrop-blur-xl bg-white/10 hover:bg-white/20 text-cyan-400 text-xs font-bold px-3.5 py-2 rounded-xl border border-white/10 transition flex items-center gap-1"
                >
                  ← العودة للمتجر العام
                </button>
              </div>
              <AdminDashboard />
            </div>
          ) : (
            <>
              {/* SLEEK COMPACT HEADER BANNER */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 sm:px-6 mb-6 shadow-xl">
                <div className="flex items-center gap-3 text-right">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                    <Gamepad2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-white">
                      متجر حسابات بيس (eFootball) الموثوق في العراق
                    </h2>
                    <p className="text-xs text-white/60">
                      تصفح واشترِ أقوى حسابات بيس eFootball مع ضمان تحويل الحساب كاملاً بواسطة الأدمن
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
                  <button
                    onClick={() => setIsDepositModalOpen(true)}
                    className="flex-1 sm:flex-none bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-cyan-500/20"
                  >
                    <Wallet className="w-4 h-4 stroke-[2.5]" />
                    <span>شحن الرصيد ({PAYMENT_PHONE})</span>
                  </button>

                  <button
                    onClick={() => setIsOrdersModalOpen(true)}
                    className="flex-1 sm:flex-none backdrop-blur-md bg-white/10 hover:bg-white/20 text-white border border-white/10 font-bold px-3.5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <ShoppingBag className="w-4 h-4 text-cyan-400" />
                    <span>مشترياتي</span>
                  </button>
                </div>
              </div>

              {/* FILTER BAR */}
              <GameFilter
                selectedGame={selectedGame}
                setSelectedGame={setSelectedGame}
                selectedPlatform={selectedPlatform}
                setSelectedPlatform={setSelectedPlatform}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                priceSort={priceSort}
                setPriceSort={setPriceSort}
              />

              {/* STORE CATALOG GRID */}
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-cyan-400" />
                  الحسابات المتوفرة للبيع ({filteredAccounts.length})
                </h3>
              </div>

              {filteredAccounts.length === 0 ? (
                <div className="text-center py-16 backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-6">
                  <SearchX className="w-12 h-12 text-white/30 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-white mb-1">لم يتم العثور على حسابات تطابق بحثك</h4>
                  <p className="text-xs text-white/60 mb-4">جرب البحث بكلمات أخرى أو اختر جميع الألعاب والمنصات.</p>
                  <button
                    onClick={() => {
                      setSelectedGame('الكل');
                      setSelectedPlatform('الكل');
                      setSearchQuery('');
                    }}
                    className="backdrop-blur-md bg-white/10 hover:bg-white/20 text-cyan-400 text-xs font-bold px-4 py-2 rounded-xl border border-white/10 transition"
                  >
                    إعادة ضبط البحث
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAccounts.map((account) => (
                    <AccountCard
                      key={account.id}
                      account={account}
                      onSelect={(acc) => setSelectedAccountModal(acc)}
                      onQuickBuy={handleQuickBuy}
                    />
                  ))}
                </div>
              )}
            </>
          )}

        </main>

        {/* ACCOUNT DETAILS MODAL */}
        <AccountDetailModal
          account={selectedAccountModal}
          onClose={() => setSelectedAccountModal(null)}
          onOpenDeposit={() => setIsDepositModalOpen(true)}
          onPurchaseSuccess={(account) => setJustPurchasedAccount(account)}
        />

        {/* PURCHASE SUCCESS CONFIRMATION MODAL */}
        <PurchaseSuccessModal
          account={justPurchasedAccount}
          onClose={() => setJustPurchasedAccount(null)}
          onOpenMyOrders={() => setIsOrdersModalOpen(true)}
        />

        {/* DEPOSIT MODAL */}
        <DepositModal
          isOpen={isDepositModalOpen}
          onClose={() => setIsDepositModalOpen(false)}
        />

        {/* PURCHASED ACCOUNTS VAULT MODAL */}
        <PurchasedAccountsModal
          isOpen={isOrdersModalOpen}
          onClose={() => setIsOrdersModalOpen(false)}
        />

        {/* FOOTER */}
        <Footer />

        {/* MOBILE APP BOTTOM NAVIGATION */}
        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenDeposit={() => setIsDepositModalOpen(true)}
          onOpenOrders={() => setIsOrdersModalOpen(true)}
        />
      </div>

    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <StoreMainContent />
    </StoreProvider>
  );
}
