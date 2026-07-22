import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { GameAccount, PaymentMethod } from '../../types';
import { PAYMENT_PHONE, ADMIN_EMAIL } from '../../data/initialData';
import { 
  Plus, Edit, Trash2, CheckCircle2, XCircle, Eye, ShieldCheck, 
  Wallet, Image, Key, PlusCircle, UserCheck, Smartphone, Search, RefreshCw, AlertCircle, X, Sparkles
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    currentUser, accounts, deposits, orders, allUsers, 
    addAccount, updateAccount, deleteAccount, approveDeposit, rejectDeposit,
    deliverOrderCredentials, updateUserWallet, showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'deposits' | 'accounts' | 'orders' | 'users'>('deposits');
  
  // Deposit Review Modal / Image Zoom
  const [selectedProofImage, setSelectedProofImage] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [rejectingDepositId, setRejectingDepositId] = useState<string | null>(null);

  // Add / Edit Account Modal
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  
  // Account Form State
  const [accTitle, setAccTitle] = useState('');
  const [accGame, setAccGame] = useState<any>('PUBG Mobile');
  const [accPlatform, setAccPlatform] = useState<any>('Mobile');
  const [accPriceIqd, setAccPriceIqd] = useState(50000);
  const [accPriceUsd, setAccPriceUsd] = useState(33);
  const [accLevel, setAccLevel] = useState(50);
  const [accRank, setAccRank] = useState('');
  const [accLoginType, setAccLoginType] = useState('Twitter / Facebook');
  const [accDescription, setAccDescription] = useState('');
  const [accHighlights, setAccHighlights] = useState<string[]>(['سكنات نادرة', 'شحن الموسم مكس']);
  const [newHighlightInput, setNewHighlightInput] = useState('');
  const [accImages, setAccImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80'
  ]);
  const [newImageUrlInput, setNewImageUrlInput] = useState('');
  
  // Credentials for auto/manual delivery
  const [accLoginId, setAccLoginId] = useState('');
  const [accPassword, setAccPassword] = useState('');
  const [accSecCode, setAccSecCode] = useState('');
  const [accInstructions, setAccInstructions] = useState('');

  // Manual wallet adjustment
  const [editingWalletUserId, setEditingWalletUserId] = useState<string | null>(null);
  const [newWalletAmount, setNewWalletAmount] = useState<number>(0);

  const pendingDeposits = deposits.filter(d => d.status === 'pending');
  const processedDeposits = deposits.filter(d => d.status !== 'pending');

  const openAddAccountModal = () => {
    setEditingAccountId(null);
    setAccTitle('');
    setAccGame('eFootball (بيس)');
    setAccPlatform('Mobile');
    setAccPriceIqd(75000);
    setAccPriceUsd(50);
    setAccLevel(100);
    setAccRank('Division 1');
    setAccLoginType('Konami ID (كونامي ايدي)');
    setAccDescription('حساب بيس eFootball جاهز للتسليم مع إمكانية نقل ملكيته فورياً على بريدك الإلكتروني الشخصي.');
    setAccHighlights(['ميسي Epic Booster 105', 'تشكيلة 3100+']);
    setAccImages(['https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80']);
    setAccLoginId('');
    setAccPassword('');
    setAccSecCode('');
    setAccInstructions('قم بتغيير كلمة المرور والربط بالبريد الشخصي فور الاستلام.');
    setIsAccountModalOpen(true);
  };

  const openEditAccountModal = (acc: GameAccount) => {
    setEditingAccountId(acc.id);
    setAccTitle(acc.title);
    setAccGame(acc.game);
    setAccPlatform(acc.platform);
    setAccPriceIqd(acc.priceIqd);
    setAccPriceUsd(acc.priceUsd);
    setAccLevel(acc.level);
    setAccRank(acc.rank || '');
    setAccLoginType(acc.loginType);
    setAccDescription(acc.description);
    setAccHighlights(acc.highlights || []);
    setAccImages(acc.images && acc.images.length > 0 ? acc.images : ['https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80']);
    setAccLoginId(acc.credentials?.loginId || '');
    setAccPassword(acc.credentials?.password || '');
    setAccSecCode(acc.credentials?.secCode || '');
    setAccInstructions(acc.credentials?.instructions || '');
    setIsAccountModalOpen(true);
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accTitle.trim()) {
      showToast('عنوان الحساب مطلوب', 'يرجى إدخال اسم الحساب', 'error');
      return;
    }

    const accountData = {
      title: accTitle,
      game: accGame,
      platform: accPlatform,
      priceIqd: Number(accPriceIqd),
      priceUsd: Number(accPriceUsd),
      level: Number(accLevel),
      rank: accRank,
      loginType: accLoginType,
      description: accDescription,
      highlights: accHighlights,
      images: accImages,
      isAvailable: true,
      credentials: accLoginId ? {
        loginId: accLoginId,
        password: accPassword,
        secCode: accSecCode,
        instructions: accInstructions
      } : undefined
    };

    if (editingAccountId) {
      updateAccount(editingAccountId, accountData);
    } else {
      addAccount(accountData);
    }

    setIsAccountModalOpen(false);
  };

  const addHighlightItem = () => {
    if (newHighlightInput.trim()) {
      setAccHighlights([...accHighlights, newHighlightInput.trim()]);
      setNewHighlightInput('');
    }
  };

  const removeHighlightItem = (index: number) => {
    setAccHighlights(accHighlights.filter((_, idx) => idx !== index));
  };

  const addImageItem = () => {
    if (newImageUrlInput.trim()) {
      setAccImages([...accImages, newImageUrlInput.trim()]);
      setNewImageUrlInput('');
    }
  };

  const removeImageItem = (index: number) => {
    if (accImages.length <= 1) {
      showToast('تنبيه', 'يجب أن يحتوي الحساب على صورة واحدة على الأقل', 'info');
      return;
    }
    setAccImages(accImages.filter((_, idx) => idx !== index));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAccImages([...accImages, event.target.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="backdrop-blur-xl bg-slate-900/80 border border-white/10 rounded-3xl p-4 sm:p-6 text-right shadow-2xl my-8">
      
      {/* Admin Panel Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white">لوحة تحكم الأدمن والتحقق</h2>
              <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
                {ADMIN_EMAIL}
              </span>
            </div>
            <p className="text-xs text-white/60 mt-0.5">
              مراجعة إثباتات زين كاش واسياسيل ({PAYMENT_PHONE})، وإضافة وتعديل حسابات الألعاب
            </p>
          </div>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-3">
          <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl text-center min-w-[100px] backdrop-blur-md">
            <span className="text-[10px] text-white/60 block">طلبات الشحن المعلقة</span>
            <span className="text-lg font-extrabold text-amber-300 font-mono">{pendingDeposits.length}</span>
          </div>

          <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl text-center min-w-[100px] backdrop-blur-md">
            <span className="text-[10px] text-white/60 block">الحسابات المعروضة</span>
            <span className="text-lg font-extrabold text-cyan-400 font-mono">{accounts.length}</span>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto pb-3 mb-6 scrollbar-none">
        
        <button
          onClick={() => setActiveTab('deposits')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition shrink-0 backdrop-blur-md ${
            activeTab === 'deposits'
              ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/20'
              : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>إثباتات الدفع وطلبات الشحن</span>
          {pendingDeposits.length > 0 && (
            <span className="bg-rose-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
              {pendingDeposits.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('accounts')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition shrink-0 backdrop-blur-md ${
            activeTab === 'accounts'
              ? 'bg-cyan-500 text-slate-900 shadow-lg shadow-cyan-500/20'
              : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>إدارة وإضافة الحسابات</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition shrink-0 backdrop-blur-md ${
            activeTab === 'orders'
              ? 'bg-emerald-500 text-slate-900 shadow-lg shadow-emerald-500/20'
              : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>المشتريات والتسليم</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition shrink-0 backdrop-blur-md ${
            activeTab === 'users'
              ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
              : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>المستخدمين والمحافظ</span>
        </button>

      </div>

      {/* TAB 1: DEPOSITS VERIFICATION QUEUE */}
      {activeTab === 'deposits' && (
        <div className="space-y-6">
          
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-amber-300" />
              طلبات التحويل بانتظار التأكيد والإضافة للرصيد
            </h3>
            <span className="text-xs text-white/60">
              الرقم المستلم للتحويلات: <strong className="text-cyan-400 font-mono dir-ltr">{PAYMENT_PHONE}</strong>
            </span>
          </div>

          {pendingDeposits.length === 0 ? (
            <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2 opacity-80" />
              <h4 className="text-sm font-bold text-white mb-1">لا توجد طلبات شحن معلقة حالياً</h4>
              <p className="text-xs text-white/60">جميع طلبات تحويل زين كاش واسياسيل تم مراجعتها وتعبئتها.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingDeposits.map((dep) => (
                <div key={dep.id} className="bg-white/5 border border-amber-500/30 rounded-2xl p-4 flex flex-col justify-between shadow-xl backdrop-blur-md">
                  
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                      <div>
                        <span className="text-xs font-extrabold text-white block">{dep.userName}</span>
                        <span className="text-[11px] text-white/60 font-mono dir-ltr">{dep.userEmail}</span>
                      </div>

                      <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-xl ${
                        dep.method === 'zain_cash'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {dep.method === 'zain_cash' ? 'زين كاش' : dep.method === 'asiacell_transfer' ? 'تحويل اسياسيل' : 'كارت اسياسيل'}
                      </span>
                    </div>

                    {/* Transfer Details Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                        <span className="text-[10px] text-white/60 block">المبلغ المطلوب شحنه:</span>
                        <span className="text-base font-black text-cyan-400 font-mono">
                          {dep.amountIqd.toLocaleString('ar-IQ')} د.ع
                        </span>
                      </div>

                      <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                        <span className="text-[10px] text-white/60 block">رقم المحول / الكود:</span>
                        <span className="text-xs font-mono font-bold text-cyan-300 dir-ltr block">
                          {dep.senderPhone}
                        </span>
                      </div>
                    </div>

                    {dep.notes && (
                      <p className="text-xs text-white/80 bg-white/5 p-2.5 rounded-xl mb-3 border border-white/10">
                        ملاحظة الزبون: {dep.notes}
                      </p>
                    )}

                    {/* Screenshot Proof Preview Button */}
                    <div className="mb-4">
                      <span className="text-[10px] text-white/60 block mb-1 font-semibold">إثبات الدفع المرفق من الزبون:</span>
                      <div 
                        onClick={() => setSelectedProofImage(dep.proofImageUrl)}
                        className="relative h-32 rounded-xl overflow-hidden border border-white/10 bg-black cursor-pointer group"
                      >
                        <img src={dep.proofImageUrl} alt="إثبات الدفع" className="w-full h-full object-cover group-hover:scale-105 transition" />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition">
                          <span className="bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-white/20">
                            <Eye className="w-4 h-4 text-cyan-400" /> تكبير الصورة للتحقق
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                    <button
                      onClick={() => approveDeposit(dep.id)}
                      className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-extrabold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-md shadow-cyan-500/20"
                    >
                      <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                      <span>موافقة وتعبئة الرصيد</span>
                    </button>

                    <button
                      onClick={() => setRejectingDepositId(dep.id)}
                      className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1 transition"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>رفض الطلب</span>
                    </button>
                  </div>

                  {/* Reject reason input popover */}
                  {rejectingDepositId === dep.id && (
                    <div className="mt-3 p-3 bg-rose-950/80 border border-rose-500/40 rounded-xl space-y-2 animate-in fade-in backdrop-blur-md">
                      <span className="text-xs font-bold text-rose-200 block">سبب الرفض للزبون:</span>
                      <input
                        type="text"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="مثال: الصورة غير واضحة، لم يصل المبلغ للحساب"
                        className="w-full bg-slate-900 border border-rose-500/40 rounded-lg p-2 text-xs text-white"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            rejectDeposit(dep.id, rejectReason || 'لم يتم تأكيد وصول المبلغ');
                            setRejectingDepositId(null);
                            setRejectReason('');
                          }}
                          className="bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg"
                        >
                          تأكيد الرفض
                        </button>
                        <button
                          onClick={() => setRejectingDepositId(null)}
                          className="text-xs text-white/60 px-2"
                        >
                          إلغاء
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}

          {/* Processed Deposits History Table */}
          {processedDeposits.length > 0 && (
            <div className="pt-6 border-t border-white/10">
              <h4 className="text-xs font-bold text-white/60 mb-3">أرشيف الطلبات المكتملة والمرفوضة:</h4>
              <div className="overflow-x-auto bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                <table className="w-full text-xs text-right">
                  <thead className="bg-white/5 text-white/70 border-b border-white/10">
                    <tr>
                      <th className="p-3">الزبون</th>
                      <th className="p-3">طريقة الدفع</th>
                      <th className="p-3">المبلغ</th>
                      <th className="p-3">الحالة</th>
                      <th className="p-3">التاريخ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {processedDeposits.map((dep) => (
                      <tr key={dep.id} className="hover:bg-white/5 transition">
                        <td className="p-3 font-semibold text-white">{dep.userName}</td>
                        <td className="p-3 text-white/70">
                          {dep.method === 'zain_cash' ? 'زين كاش' : 'اسياسيل'}
                        </td>
                        <td className="p-3 font-mono font-bold text-cyan-400">{dep.amountIqd.toLocaleString('ar-IQ')} د.ع</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            dep.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                          }`}>
                            {dep.status === 'approved' ? 'تم الشحن' : 'مرفوض'}
                          </span>
                        </td>
                        <td className="p-3 text-white/60 font-mono">{new Date(dep.createdAt).toLocaleDateString('ar-IQ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 2: GAME ACCOUNTS MANAGER (ADD / EDIT) */}
      {activeTab === 'accounts' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">إدارة وإضافة حسابات الألعاب المتوفرة</h3>
            <button
              onClick={openAddAccountModal}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-lg shadow-cyan-500/20"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>إضافة حساب لعبة جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((acc) => (
              <div key={acc.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between backdrop-blur-md">
                <div>
                  <div className="relative h-40 rounded-xl overflow-hidden mb-3 bg-white/5 border border-white/10">
                    <img src={acc.images[0]} alt={acc.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-md text-cyan-300 text-[10px] font-bold px-2 py-0.5 rounded border border-white/10">
                      {acc.game}
                    </span>
                    <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-md ${
                      acc.isAvailable ? 'bg-emerald-500 text-slate-900' : 'bg-rose-600 text-white'
                    }`}>
                      {acc.isAvailable ? 'متوفر' : 'مبيوع'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white line-clamp-2 mb-2">{acc.title}</h4>
                  
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-cyan-400 font-extrabold font-mono">{acc.priceIqd.toLocaleString('ar-IQ')} د.ع</span>
                    <span className="text-white/60 font-mono">(${acc.priceUsd})</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                  <button
                    onClick={() => openEditAccountModal(acc)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/10 text-xs py-2 rounded-xl font-semibold flex items-center justify-center gap-1 transition"
                  >
                    <Edit className="w-3.5 h-3.5 text-cyan-400" />
                    <span>تعديل</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('هل أنت متأكد من إزالة هذا الحساب من المتجر؟')) {
                        deleteAccount(acc.id);
                      }
                    }}
                    className="p-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-xl transition border border-rose-500/30"
                    title="حذف الحساب"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS & DELIVERIES */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <h3 className="text-base font-bold text-white mb-4">قائمة مشتريات الزبائن وتسليم معلومات الحسابات</h3>
          
          <div className="overflow-x-auto bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
            <table className="w-full text-xs text-right">
              <thead className="bg-white/5 text-white/70 border-b border-white/10">
                <tr>
                  <th className="p-3">رقم الطلب</th>
                  <th className="p-3">عنوان الحساب واللعبة</th>
                  <th className="p-3">الزبون</th>
                  <th className="p-3">السعر</th>
                  <th className="p-3">حالة التسليم</th>
                  <th className="p-3">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-white/5 transition">
                    <td className="p-3 font-mono text-white/60">{ord.id}</td>
                    <td className="p-3 font-bold text-white max-w-xs">{ord.accountTitle} ({ord.game})</td>
                    <td className="p-3">
                      <span className="block font-semibold text-white/90">{ord.userName}</span>
                      <span className="text-[10px] text-white/50 font-mono dir-ltr block">{ord.userEmail}</span>
                    </td>
                    <td className="p-3 font-mono font-bold text-cyan-400">{ord.priceIqd.toLocaleString('ar-IQ')} د.ع</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        ord.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {ord.status === 'delivered' ? 'تم التسليم' : 'بانتظار التسليم'}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => {
                          const loginId = prompt('أدخل إيميل أو يوزر الدخول للحساب:', ord.credentials?.loginId || '');
                          if (!loginId) return;
                          const password = prompt('أدخل كلمة المرور:', ord.credentials?.password || '');
                          if (!password) return;
                          const secCode = prompt('رمز الأمان الخارجي (اختياري):', ord.credentials?.secCode || '');

                          deliverOrderCredentials(ord.id, {
                            loginId,
                            password,
                            secCode,
                            instructions: 'قم بتغيير كلمة المرور فور الدخول للحساب.'
                          });
                        }}
                        className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition"
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>تحديث / تسليم التفاصيل</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: USERS & WALLETS */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <h3 className="text-base font-bold text-white mb-4">قائمة الزبائن وتعديل الرصيد المباشر</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allUsers.map((user) => (
              <div key={user.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between backdrop-blur-md">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white text-sm">{user.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      user.role === 'admin' ? 'bg-amber-500/20 text-amber-300' : 'bg-cyan-500/20 text-cyan-300'
                    }`}>
                      {user.role === 'admin' ? 'أدمن' : 'زبون'}
                    </span>
                  </div>
                  <span className="text-xs text-white/60 font-mono dir-ltr block mb-2">{user.email}</span>
                  
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-white/60">الرصيد الحالي:</span>
                    <span className="text-sm font-black text-cyan-400 font-mono">{user.walletBalanceIqd.toLocaleString('ar-IQ')} د.ع</span>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => {
                      const amountStr = prompt(`تعديل رصيد الزبون (${user.name}): أدخل الرصيد الجديد بالدينار العراقي:`, user.walletBalanceIqd.toString());
                      if (amountStr !== null && !isNaN(Number(amountStr))) {
                        updateUserWallet(user.id, Number(amountStr));
                      }
                    }}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/10 text-xs px-3 py-2 rounded-xl font-bold flex items-center gap-1 transition"
                  >
                    <Wallet className="w-3.5 h-3.5 text-cyan-400" />
                    <span>تعديل الرصيد</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PROOF IMAGE ENLARGED MODAL */}
      {selectedProofImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative backdrop-blur-2xl bg-slate-900/90 border border-white/10 rounded-3xl p-4 max-w-2xl w-full text-center">
            <button
              onClick={() => setSelectedProofImage(null)}
              className="absolute top-4 left-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
            <h4 className="text-sm font-bold text-white mb-3">صورة إثبات تحويل زين كاش / اسياسيل</h4>
            <img src={selectedProofImage} alt="الإثبات" className="max-h-[70vh] mx-auto rounded-xl border border-white/10 object-contain" />
          </div>
        </div>
      )}

      {/* ADD / EDIT GAME ACCOUNT MODAL */}
      {isAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative backdrop-blur-2xl bg-slate-900/90 border border-white/10 rounded-3xl max-w-2xl w-full my-auto overflow-hidden shadow-2xl p-6 text-right">
            
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <h3 className="text-base font-bold text-white">
                {editingAccountId ? 'تعديل بيانات الحساب' : 'إضافة حساب لعبة جديد للمتجر'}
              </h3>
              <button onClick={() => setIsAccountModalOpen(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAccount} className="space-y-4 max-h-[75vh] overflow-y-auto pl-1">
              
              {/* Title */}
              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">عنوان الحساب والعرض:</label>
                <input
                  type="text"
                  value={accTitle}
                  onChange={(e) => setAccTitle(e.target.value)}
                  placeholder="مثال: حساب بيس eFootball ميسي Epic Booster 105 + نيمار 104"
                  className="w-full bg-white/5 border border-white/10 focus:border-cyan-400/80 rounded-xl p-2.5 text-xs text-white backdrop-blur-md"
                  required
                />
              </div>

              {/* Game & Platform */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-white/80 block mb-1">فئة حساب بيس:</label>
                  <select
                    value={accGame}
                    onChange={(e) => setAccGame(e.target.value as any)}
                    className="w-full bg-slate-900 border border-white/10 focus:border-cyan-400/80 rounded-xl p-2.5 text-xs text-white"
                  >
                    <option value="eFootball (بيس)">eFootball (بيس)</option>
                    <option value="eFootball Mobile">eFootball Mobile</option>
                    <option value="eFootball PC/Console">eFootball PC/Console</option>
                    <option value="حسابات بيس خارقة">حسابات بيس خارقة</option>
                    <option value="حسابات ايبك ونادرة">حسابات ايبك ونادرة</option>
                    <option value="حسابات بيس اقتصادية">حسابات بيس اقتصادية</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-white/80 block mb-1">المنصة:</label>
                  <select
                    value={accPlatform}
                    onChange={(e) => setAccPlatform(e.target.value as any)}
                    className="w-full bg-slate-900 border border-white/10 focus:border-cyan-400/80 rounded-xl p-2.5 text-xs text-white"
                  >
                    <option value="Mobile">Mobile (موبايل)</option>
                    <option value="PC">PC (كمبيوتر)</option>
                    <option value="Console">Console (بلايستيشن / اكس بوكس)</option>
                    <option value="Cross-Platform">Cross-Platform (مشترك)</option>
                  </select>
                </div>
              </div>

              {/* Price IQD & USD */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-white/80 block mb-1">السعر بالدينار العراقي (IQD):</label>
                  <input
                    type="number"
                    value={accPriceIqd}
                    onChange={(e) => setAccPriceIqd(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 focus:border-cyan-400/80 rounded-xl p-2.5 text-xs text-white font-mono backdrop-blur-md"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-white/80 block mb-1">السعر بالدولار (USD):</label>
                  <input
                    type="number"
                    value={accPriceUsd}
                    onChange={(e) => setAccPriceUsd(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 focus:border-cyan-400/80 rounded-xl p-2.5 text-xs text-white font-mono backdrop-blur-md"
                  />
                </div>
              </div>

              {/* Level & Rank & LoginType */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-bold text-white/80 block mb-1">المستوى (Level):</label>
                  <input
                    type="number"
                    value={accLevel}
                    onChange={(e) => setAccLevel(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 focus:border-cyan-400/80 rounded-xl p-2 text-xs text-white font-mono backdrop-blur-md"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-white/80 block mb-1">الرتبة / التقييم:</label>
                  <input
                    type="text"
                    value={accRank}
                    onChange={(e) => setAccRank(e.target.value)}
                    placeholder="مثال: كونكر / أنريل"
                    className="w-full bg-white/5 border border-white/10 focus:border-cyan-400/80 rounded-xl p-2 text-xs text-white backdrop-blur-md"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-white/80 block mb-1">نوع الربط:</label>
                  <input
                    type="text"
                    value={accLoginType}
                    onChange={(e) => setAccLoginType(e.target.value)}
                    placeholder="تويتر / فيسبوك / ايبك"
                    className="w-full bg-white/5 border border-white/10 focus:border-cyan-400/80 rounded-xl p-2 text-xs text-white backdrop-blur-md"
                  />
                </div>
              </div>

              {/* MULTIPLE IMAGES SECTION (REQUIREMENT) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/80 block">
                  صور الحساب (يمكن إضافة أكثر من صورة للحساب):
                </label>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newImageUrlInput}
                    onChange={(e) => setNewImageUrlInput(e.target.value)}
                    placeholder="رابط صورة جديدة (URL)..."
                    className="flex-1 bg-white/5 border border-white/10 focus:border-cyan-400/80 rounded-xl p-2 text-xs text-white backdrop-blur-md"
                  />
                  <button
                    type="button"
                    onClick={addImageItem}
                    className="bg-cyan-500 text-slate-900 font-bold px-3 py-2 rounded-xl text-xs shrink-0"
                  >
                    + إضافة الرابط
                  </button>

                  <label className="bg-white/10 hover:bg-white/20 text-white border border-white/10 text-xs font-bold px-3 py-2 rounded-xl cursor-pointer shrink-0">
                    رفع صورة
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                {/* Images preview list */}
                <div className="grid grid-cols-4 gap-2 pt-2">
                  {accImages.map((img, idx) => (
                    <div key={idx} className="relative rounded-xl overflow-hidden h-20 border border-white/10 bg-white/5 group backdrop-blur-md">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImageItem(idx)}
                        className="absolute top-1 left-1 bg-rose-600 text-white p-1 rounded-full opacity-80 hover:opacity-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">وصف الحساب التفصيلي:</label>
                <textarea
                  rows={2}
                  value={accDescription}
                  onChange={(e) => setAccDescription(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-cyan-400/80 rounded-xl p-2.5 text-xs text-white backdrop-blur-md"
                />
              </div>

              {/* Credentials for delivery */}
              <div className="p-3 bg-white/5 rounded-2xl border border-amber-500/30 space-y-3 backdrop-blur-md">
                <span className="text-xs font-bold text-amber-300 block">معلومات تسجيل الدخول السرية (تسلم للمشتري):</span>
                
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={accLoginId}
                    onChange={(e) => setAccLoginId(e.target.value)}
                    placeholder="الإيميل / اسم المستخدم"
                    className="bg-white/5 border border-white/10 rounded-xl p-2 text-xs text-white font-mono dir-ltr text-right backdrop-blur-md"
                  />

                  <input
                    type="text"
                    value={accPassword}
                    onChange={(e) => setAccPassword(e.target.value)}
                    placeholder="كلمة السر"
                    className="bg-white/5 border border-white/10 rounded-xl p-2 text-xs text-white font-mono dir-ltr text-right backdrop-blur-md"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-white/10">
                <button
                  type="submit"
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-extrabold py-3 rounded-xl text-sm transition shadow-lg shadow-cyan-500/20"
                >
                  حفظ الحساب ونشره بالمتجر
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
