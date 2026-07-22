export type GameCategory = 
  | 'eFootball (بيس)'
  | 'eFootball Mobile'
  | 'eFootball PC/Console'
  | 'حسابات بيس خارقة'
  | 'حسابات ايبك ونادرة'
  | 'حسابات بيس اقتصادية';

export type Platform = 'Mobile' | 'PC' | 'Console' | 'Cross-Platform';

export type PaymentMethod = 'zain_cash' | 'asiacell_transfer' | 'asiacell_card';

export interface GameAccount {
  id: string;
  title: string;
  game: GameCategory;
  platform: Platform;
  priceIqd: number;
  priceUsd: number;
  level: number;
  rank?: string;
  images: string[];
  description: string;
  highlights: string[]; // Key skins, items, or stats
  loginType: string; // e.g., 'Twitter / Facebook', 'Epic Games', 'Riot Games', 'Supercell ID'
  isAvailable: boolean;
  createdAt: string;
  
  // Credentials (Only visible to Admin or the Buyer after order delivery)
  credentials?: {
    loginId: string;
    password: string;
    secCode?: string;
    instructions?: string;
  };
}

export interface DepositRequest {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  method: PaymentMethod;
  amountIqd: number;
  senderPhone: string; // Phone number or Card Code
  proofImageUrl: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
  processedAt?: string;
}

export interface Order {
  id: string;
  accountId: string;
  accountTitle: string;
  game: GameCategory;
  priceIqd: number;
  userId: string;
  userEmail: string;
  userName: string;
  status: 'pending_delivery' | 'delivered' | 'cancelled';
  credentials?: {
    loginId: string;
    password: string;
    secCode?: string;
    instructions?: string;
  };
  createdAt: string;
  deliveredAt?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  photoURL?: string;
  walletBalanceIqd: number;
  role: 'admin' | 'customer';
  isGoogleUser?: boolean;
}
