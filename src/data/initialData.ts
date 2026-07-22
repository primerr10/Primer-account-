import { GameAccount, DepositRequest, Order, UserProfile } from '../types';

export const ADMIN_EMAIL = 'primerr10x@gmail.com';
export const PAYMENT_PHONE = '07725438386';

export const INITIAL_ACCOUNTS: GameAccount[] = [
  {
    id: 'acc-1',
    title: 'حساب بيس eFootball خارق | ميسي الايبك 105 + رومينيغه وبيكهام وغوليت | قوة الفريق 3180+',
    game: 'eFootball (بيس)',
    platform: 'Mobile',
    priceIqd: 110000,
    priceUsd: 73,
    level: 150,
    rank: 'Division 1 (الدوري الأول)',
    images: [
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'حساب بيس eFootball أسطوري يحتوي على كارت ميسي Epic Booster 105، رومينيغه Big Time، غوليت مكس، بيكهام النادر، ورونالدينيو. قوة الفريق الإجمالية تتجاوز 3180. رصيد 1,500 كوينز جاهزة وبوينت كونامي ممتاز.',
    highlights: [
      'ميسي Epic Booster (ريتينغ 105)',
      'رومينيغه Big Time + غوليت',
      'قوة التشكيلة (Team Power 3180+)',
      '1,500 eFootball Coins متوفرة'
    ],
    loginType: 'Konami ID (كونامي ايدي)',
    isAvailable: true,
    createdAt: new Date().toISOString(),
    credentials: {
      loginId: 'efootball_messi_105@gmail.com',
      password: 'PassWord#2026!pes',
      secCode: '883910',
      instructions: 'تسليم فورياً مع إيميل كونامي الأصلي والباسورد وتغيير البريد فور استلامك.'
    }
  },
  {
    id: 'acc-2',
    title: 'حساب بيس eFootball أساطير الـ Big Time | نيمار 104 + كرويف ومالديني وفانيستلروي',
    game: 'eFootball Mobile',
    platform: 'Mobile',
    priceIqd: 85000,
    priceUsd: 56,
    level: 120,
    rank: 'Division 1',
    images: [
      'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'حساب بيس موبايل ممتاز جداً بتشكيلة متكاملة للدفاع والهجوم. نيمار Big Time، كرويف إيبك بوستر، مالديني السد المنيع، وفانيستلروي. مربط بياض كامل على Konami ID.',
    highlights: [
      'نيمار Big Time Santos 104',
      'كرويف + مالديني الدفاع الصلب',
      'قوة الفريق 3120+',
      '4,000,000 GP + 800 Coins'
    ],
    loginType: 'Konami ID (كونامي ايدي)',
    isAvailable: true,
    createdAt: new Date().toISOString(),
    credentials: {
      loginId: 'pes_neymar_bigtime@outlook.com',
      password: 'KonamiPes#2026',
      instructions: 'الحساب بياض جاهز لنقل الملكية على إيميلك الشخصي مباشرة.'
    }
  },
  {
    id: 'acc-3',
    title: 'حساب بيس eFootball نادراً للكمبيوتر والسوني | كريستيانو رونالدو شوتايم + مالديني وفييرا 3150+',
    game: 'eFootball PC/Console',
    platform: 'Console',
    priceIqd: 140000,
    priceUsd: 93,
    level: 180,
    rank: 'Division 1 (Top 500)',
    images: [
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'حساب بيس سوني وبلايستيشن 5 أسطوري. يحتوي على رونالدو Showtime Booster، باتيستوتا، فييرا الوحش في الوسط، ومالديني. ترتيب الحساب ضمن أفضل 500 لاعب بالدوري.',
    highlights: [
      'رونالدو Showtime Booster',
      'باتيستوتا + فييرا الوسط',
      'ترتيب Top 500 سيرفر الشرق الأوسط',
      '2,200 Coins جاهزة للشحن'
    ],
    loginType: 'Konami ID / PlayStation',
    isAvailable: true,
    createdAt: new Date().toISOString(),
    credentials: {
      loginId: 'pes_ps5_ronaldo@gmail.com',
      password: 'RonaldoPes2026#',
      instructions: 'يتم نقل حساب بلايستيشن والـ Konami ID لك بأمان تام.'
    }
  },
  {
    id: 'acc-4',
    title: 'حساب بيس اقتصادية متوازن | تشكيلة 3050+ مع ميسي المجاني وكليان مبابي وجوارديولا مدرب',
    game: 'حسابات بيس اقتصادية',
    platform: 'Mobile',
    priceIqd: 35000,
    priceUsd: 23,
    level: 80,
    rank: 'Division 2',
    images: [
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'حساب بيس ممتاز ومناسب للمبتدئين واللاعبين المتوسطين، يحتوي على تشكيلة قوية فوق 3050 مع مدرب جوارديولا 88 تكتيك وسرعة عالية.',
    highlights: [
      'قوة الفريق 3050+',
      'مبابي Highlight 101',
      'المدرب جوارديولا (Pep Guardiola 88)',
      '1,200,000 GP متوفرة'
    ],
    loginType: 'Konami ID',
    isAvailable: true,
    createdAt: new Date().toISOString(),
    credentials: {
      loginId: 'pes_starter_iq@gmail.com',
      password: 'StarterPes#2026',
      instructions: 'كود التحقق يرسل لك مباشرة عبر الأدمن.'
    }
  }
];

export const INITIAL_DEPOSITS: DepositRequest[] = [
  {
    id: 'dep-101',
    userId: 'usr-customer-1',
    userEmail: 'ahmed.gamer@gmail.com',
    userName: 'أحمد العراقي',
    method: 'zain_cash',
    amountIqd: 110000,
    senderPhone: '07701234567',
    proofImageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
    notes: 'تم تحويل 110 الف دينار عبر زين كاش لرقم 07725438386 لشراء حساب بيس ميسي 105',
    status: 'pending',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: 'dep-102',
    userId: 'usr-customer-2',
    userEmail: 'mustafa_pes@yahoo.com',
    userName: 'مصطفى حسين',
    method: 'asiacell_transfer',
    amountIqd: 50000,
    senderPhone: '07719876543',
    proofImageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80',
    notes: 'تحويل رصيد اسياسيل بقيمة 50,000 دينار لرقم 07725438386 لشحن محفظة لشراء حساب بيس',
    status: 'pending',
    createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString()
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-201',
    accountId: 'acc-prev-101',
    accountTitle: 'حساب بيس eFootball تشكيلة 3000 (سابق)',
    game: 'eFootball (بيس)',
    priceIqd: 35000,
    userId: 'usr-customer-1',
    userEmail: 'ahmed.gamer@gmail.com',
    userName: 'أحمد العراقي',
    status: 'delivered',
    credentials: {
      loginId: 'pes_account_v3000@gmail.com',
      password: 'PasswordSafe#123',
      instructions: 'تم التسليم بنجاح وتأكيد نقل ملكية الحساب.'
    },
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    deliveredAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString()
  }
];

export const DEMO_USERS: UserProfile[] = [
  {
    id: 'usr-admin',
    email: ADMIN_EMAIL,
    name: 'مدير الموقع (الادمن)',
    phone: '07725438386',
    walletBalanceIqd: 0,
    role: 'admin'
  },
  {
    id: 'usr-customer-1',
    email: 'ahmed.gamer@gmail.com',
    name: 'أحمد العراقي',
    phone: '07701234567',
    walletBalanceIqd: 0,
    role: 'customer'
  }
];
