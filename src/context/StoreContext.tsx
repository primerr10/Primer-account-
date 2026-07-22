import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GameAccount, DepositRequest, Order, UserProfile, PaymentMethod } from '../types';
import { INITIAL_ACCOUNTS, INITIAL_DEPOSITS, INITIAL_ORDERS, DEMO_USERS, ADMIN_EMAIL } from '../data/initialData';
import { auth, signInWithGoogle, signOutUser, onAuthStateChanged, FirebaseUser } from '../firebase';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

interface StoreContextType {
  currentUser: UserProfile;
  accounts: GameAccount[];
  deposits: DepositRequest[];
  orders: Order[];
  allUsers: UserProfile[];
  toast: ToastMessage | null;
  isAdmin: boolean;
  isAuthLoading: boolean;

  // Firebase Auth operations
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;

  // Role switching for demo
  switchUserRole: (email: string) => void;

  // Account operations (Admin)
  addAccount: (account: Omit<GameAccount, 'id' | 'createdAt'>) => void;
  updateAccount: (id: string, accountData: Partial<GameAccount>) => void;
  deleteAccount: (id: string) => void;

  // Deposit operations
  submitDeposit: (method: PaymentMethod, amountIqd: number, senderPhone: string, proofImageUrl: string, notes?: string) => Promise<boolean>;
  approveDeposit: (depositId: string, approvedAmount?: number) => void;
  rejectDeposit: (depositId: string, reason: string) => void;

  // Order & Purchase operations
  buyAccount: (accountId: string) => { success: boolean; message: string };
  deliverOrderCredentials: (orderId: string, credentials: { loginId: string; password: string; secCode?: string; instructions?: string }) => void;

  // Toast
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
  clearToast: () => void;
  
  // Wallet manual update
  updateUserWallet: (userId: string, newBalance: number) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_ACCOUNTS = 'iraq_game_accounts_v1';
const LOCAL_STORAGE_KEY_DEPOSITS = 'iraq_game_deposits_v1';
const LOCAL_STORAGE_KEY_ORDERS = 'iraq_game_orders_v1';
const LOCAL_STORAGE_KEY_USERS = 'iraq_game_users_v1';
const LOCAL_STORAGE_KEY_CURRENT_USER = 'iraq_game_current_user_v1';

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  // Accounts State
  const [accounts, setAccounts] = useState<GameAccount[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ACCOUNTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_ACCOUNTS;
  });

  // Deposits State
  const [deposits, setDeposits] = useState<DepositRequest[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_DEPOSITS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_DEPOSITS;
  });

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ORDERS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_ORDERS;
  });

  // Users State
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_USERS);
    if (saved) {
      try {
        const parsed: UserProfile[] = JSON.parse(saved);
        // Reset any legacy 1,000,000 demo balance to 0
        return parsed.map(u => u.walletBalanceIqd === 1000000 ? { ...u, walletBalanceIqd: 0 } : u);
      } catch (e) { console.error(e); }
    }
    return DEMO_USERS;
  });

  // Current Logged In User
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CURRENT_USER);
    if (saved) {
      try {
        const parsed: UserProfile = JSON.parse(saved);
        if (parsed.walletBalanceIqd === 1000000) {
          parsed.walletBalanceIqd = 0;
        }
        return parsed;
      } catch (e) { console.error(e); }
    }
    return DEMO_USERS[0];
  });

  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
      if (fbUser && fbUser.email) {
        const userEmail = fbUser.email;
        const displayName = fbUser.displayName || userEmail.split('@')[0];
        const photoURL = fbUser.photoURL || undefined;
        const isAdminRole = userEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase();

        setAllUsers((prevUsers) => {
          const existing = prevUsers.find((u) => u.email.toLowerCase() === userEmail.toLowerCase());
          if (existing) {
            const updated: UserProfile = {
              ...existing,
              name: displayName,
              photoURL,
              walletBalanceIqd: existing.walletBalanceIqd === 1000000 ? 0 : existing.walletBalanceIqd,
              isGoogleUser: true,
              role: isAdminRole ? 'admin' : existing.role
            };
            setCurrentUser(updated);
            return prevUsers.map((u) => (u.id === existing.id ? updated : u));
          } else {
            const newUser: UserProfile = {
              id: fbUser.uid,
              email: userEmail,
              name: displayName,
              photoURL,
              walletBalanceIqd: 0,
              role: isAdminRole ? 'admin' : 'customer',
              isGoogleUser: true
            };
            setCurrentUser(newUser);
            return [...prevUsers, newUser];
          }
        });
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login with Google
  const loginWithGoogle = async () => {
    const { user: fbUser, error } = await signInWithGoogle();
    if (error) {
      showToast('خطأ في تسجيل الدخول', error, 'error');
    } else if (fbUser) {
      showToast('مرحباً بك!', `تم تسجيل الدخول بنجاح بواسطة Google (${fbUser.email})`, 'success');
    }
  };

  // Logout
  const logout = async () => {
    await signOutUser();
    // Reset to default demo user or guest
    const defaultUser = DEMO_USERS[0];
    setCurrentUser(defaultUser);
    showToast('تم تسجيل الخروج', 'تم خروجك من حساب Google بنجاح', 'info');
  };

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_DEPOSITS, JSON.stringify(deposits));
  }, [deposits]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_USERS, JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_CURRENT_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  const isAdmin = currentUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const showToast = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ id: Date.now().toString(), title, message, type });
  };

  const clearToast = () => setToast(null);

  // Switch User Role
  const switchUserRole = (email: string) => {
    const found = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      showToast('تم تغيير الحساب', `تم التحول إلى ${found.name} (${found.role === 'admin' ? 'مدير' : 'زبون'})`, 'info');
    } else {
      // Create new customer profile if email not found
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        email,
        name: email.split('@')[0],
        walletBalanceIqd: 0,
        role: email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'customer'
      };
      setAllUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      showToast('حساب جديد', `تم تسجل الدخول بحساب ${email}`, 'success');
    }
  };

  // Add Game Account
  const addAccount = (newAcc: Omit<GameAccount, 'id' | 'createdAt'>) => {
    const created: GameAccount = {
      ...newAcc,
      id: `acc-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setAccounts(prev => [created, ...prev]);
    showToast('تمت الإضافة', `تم إضافة الحساب "${created.title}" بنجاح`, 'success');
  };

  // Update Game Account
  const updateAccount = (id: string, accountData: Partial<GameAccount>) => {
    setAccounts(prev => prev.map(acc => acc.id === id ? { ...acc, ...accountData } : acc));
    showToast('تم التحديث', 'تم حفظ تعديلات الحساب بنجاح', 'success');
  };

  // Delete Game Account
  const deleteAccount = (id: string) => {
    setAccounts(prev => prev.filter(acc => acc.id !== id));
    showToast('تم الحذف', 'تم إزالة الحساب من المتجر', 'info');
  };

  // Submit Deposit Request
  const submitDeposit = async (
    method: PaymentMethod,
    amountIqd: number,
    senderPhone: string,
    proofImageUrl: string,
    notes?: string
  ): Promise<boolean> => {
    const newDeposit: DepositRequest = {
      id: `dep-${Date.now()}`,
      userId: currentUser.id,
      userEmail: currentUser.email,
      userName: currentUser.name,
      method,
      amountIqd,
      senderPhone,
      proofImageUrl,
      notes,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setDeposits(prev => [newDeposit, ...prev]);
    showToast('تم إرسال الإثبات', 'تم إرسال طلب الشحن وهو الآن قيد مراجعة الأدمن. سيتم إضافة الرصيد فور التأكد.', 'success');
    return true;
  };

  // Approve Deposit (Admin action)
  const approveDeposit = (depositId: string, approvedAmount?: number) => {
    const targetDeposit = deposits.find(d => d.id === depositId);
    if (!targetDeposit) return;

    const amountToAdd = approvedAmount || targetDeposit.amountIqd;

    // Mark deposit approved
    setDeposits(prev => prev.map(d => d.id === depositId ? {
      ...d,
      status: 'approved',
      amountIqd: amountToAdd,
      processedAt: new Date().toISOString()
    } : d));

    // Update user's wallet
    setAllUsers(prev => prev.map(u => {
      if (u.id === targetDeposit.userId || u.email === targetDeposit.userEmail) {
        return { ...u, walletBalanceIqd: u.walletBalanceIqd + amountToAdd };
      }
      return u;
    }));

    // If active current user is the recipient, update current user state
    if (currentUser.id === targetDeposit.userId || currentUser.email === targetDeposit.userEmail) {
      setCurrentUser(prev => ({ ...prev, walletBalanceIqd: prev.walletBalanceIqd + amountToAdd }));
    }

    showToast('تم قبول الدفع', `تمت موافقة الطلب وإضافة ${amountToAdd.toLocaleString('ar-IQ')} د.ع لحساب الزبون (${targetDeposit.userName})`, 'success');
  };

  // Reject Deposit (Admin action)
  const rejectDeposit = (depositId: string, reason: string) => {
    setDeposits(prev => prev.map(d => d.id === depositId ? {
      ...d,
      status: 'rejected',
      rejectionReason: reason,
      processedAt: new Date().toISOString()
    } : d));

    showToast('تم رفض الطلب', 'تم تسجيل رفض إثبات الدفع مع سبب الرفض', 'info');
  };

  // Buy Account
  const buyAccount = (accountId: string): { success: boolean; message: string } => {
    const account = accounts.find(a => a.id === accountId);
    if (!account) return { success: false, message: 'الحساب غير موجود' };
    if (!account.isAvailable) return { success: false, message: 'عذراً، تم شراء هذا الحساب بالفعل' };

    if (currentUser.walletBalanceIqd < account.priceIqd) {
      return {
        success: false,
        message: `رصيد محفظتك الحالي (${currentUser.walletBalanceIqd.toLocaleString('ar-IQ')} د.ع) غير كافٍ. تحتاج إلى ${account.priceIqd.toLocaleString('ar-IQ')} د.ع لشراء هذا الحساب.`
      };
    }

    // Deduct wallet balance
    const updatedBalance = currentUser.walletBalanceIqd - account.priceIqd;
    setCurrentUser(prev => ({ ...prev, walletBalanceIqd: updatedBalance }));

    setAllUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, walletBalanceIqd: updatedBalance } : u));

    // Mark account sold/unavailable
    setAccounts(prev => prev.map(a => a.id === accountId ? { ...a, isAvailable: false } : a));

    // Create Order
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      accountId: account.id,
      accountTitle: account.title,
      game: account.game,
      priceIqd: account.priceIqd,
      userId: currentUser.id,
      userEmail: currentUser.email,
      userName: currentUser.name,
      status: account.credentials ? 'delivered' : 'pending_delivery',
      credentials: account.credentials,
      createdAt: new Date().toISOString(),
      deliveredAt: account.credentials ? new Date().toISOString() : undefined
    };

    setOrders(prev => [newOrder, ...prev]);

    showToast('تم الشراء بنجاح! 🎉', 'تم خصم المبلغ بنجاح. وسيقوم الأدمن بالتواصل معك مباشرة لنقل ملكية الحساب لك وتأكيد بياناته.', 'success');

    return { success: true, message: 'تم الشراء بنجاح' };
  };

  // Deliver credentials manually by Admin
  const deliverOrderCredentials = (orderId: string, credentials: { loginId: string; password: string; secCode?: string; instructions?: string }) => {
    setOrders(prev => prev.map(o => o.id === orderId ? {
      ...o,
      status: 'delivered',
      credentials,
      deliveredAt: new Date().toISOString()
    } : o));

    showToast('تم تسليم معلومات الحساب', 'تم إرسال وتوفير معلومات الحساب للزبون بنجاح', 'success');
  };

  // Manual wallet balance adjustment
  const updateUserWallet = (userId: string, newBalance: number) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, walletBalanceIqd: newBalance } : u));
    if (currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, walletBalanceIqd: newBalance }));
    }
    showToast('تم تحديث المحفظة', 'تم تعديل رصيد الزبون بنجاح', 'success');
  };

  return (
    <StoreContext.Provider
      value={{
        currentUser,
        accounts,
        deposits,
        orders,
        allUsers,
        toast,
        isAdmin,
        isAuthLoading,
        loginWithGoogle,
        logout,
        switchUserRole,
        addAccount,
        updateAccount,
        deleteAccount,
        submitDeposit,
        approveDeposit,
        rejectDeposit,
        buyAccount,
        deliverOrderCredentials,
        showToast,
        clearToast,
        updateUserWallet
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
