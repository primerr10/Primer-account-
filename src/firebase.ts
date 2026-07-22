import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User as FirebaseUser,
  Auth
} from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Safely load JSON or fallback
let firebaseConfigJson: any = {};
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  firebaseConfigJson = require('../firebase-applet-config.json');
} catch (e) {
  // Fallback if file is absent on Vercel/GitHub
}

const env = (import.meta as any).env || {};

const apiKey = env.VITE_FIREBASE_API_KEY || firebaseConfigJson.apiKey || '';
const authDomain = env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigJson.authDomain || '';
const projectId = env.VITE_FIREBASE_PROJECT_ID || firebaseConfigJson.projectId || '';
const storageBucket = env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigJson.storageBucket || '';
const messagingSenderId = env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigJson.messagingSenderId || '';
const appId = env.VITE_FIREBASE_APP_ID || firebaseConfigJson.appId || '';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (apiKey && apiKey.trim() !== '') {
  try {
    const firebaseConfig = {
      apiKey,
      authDomain,
      projectId,
      storageBucket,
      messagingSenderId,
      appId
    };

    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app, firebaseConfigJson.firestoreDatabaseId || '(default)');
    googleProvider = new GoogleAuthProvider();
  } catch (err) {
    console.warn('Firebase initialization failed or invalid API key:', err);
    app = null;
    auth = null;
    db = null;
    googleProvider = null;
  }
}

export { auth, db, googleProvider };

// Safe Auth State Changed wrapper
export const onAuthStateChanged = (
  authInstance: Auth | null,
  callback: (user: FirebaseUser | null) => void
) => {
  if (!authInstance) {
    callback(null);
    return () => {};
  }
  try {
    return firebaseOnAuthStateChanged(authInstance, callback);
  } catch (err) {
    console.warn('onAuthStateChanged error:', err);
    callback(null);
    return () => {};
  }
};

// Google Sign-In helper
export const signInWithGoogle = async () => {
  if (!auth || !googleProvider) {
    return {
      user: null,
      error: 'مفاتيح Firebase Google غير مهيأة أو غير صالحة. يمكنك استخدام "تسجيل الدخول المباشر بالبريد".'
    };
  }

  try {
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error('Error signing in with Google:', error);
    let friendlyError = error.message || 'فشل تسجيل الدخول بـ Google';

    if (error.code === 'auth/invalid-api-key' || error.message?.includes('invalid-api-key')) {
      friendlyError = 'مفتاح API الخاص بـ Firebase غير صالحة أو غير مفعّلة في المشروع.';
    } else if (error.code === 'auth/unauthorized-domain' || error.message?.includes('unauthorized-domain')) {
      friendlyError = `نطاق الاستضافة الحالية (${window.location.hostname}) غير مضاف إلى القائمة المسموحة في Firebase Authentication. لتمكين جوجل: افتح Firebase Console > Authentication > Settings > Authorized domains وأضف ${window.location.hostname}`;
    } else if (error.code === 'auth/popup-blocked') {
      friendlyError = 'تم حظر النافذة المنبثقة من قبل المتصفح. يرجى إيقاف حظر النوافذ المنبثقة (Pop-up Blocker).';
    } else if (error.code === 'auth/popup-closed-by-user') {
      friendlyError = 'تم إغلاق نافذة تسجيل الدخول من قبل المستخدم.';
    }

    return { user: null, error: friendlyError };
  }
};

// Logout helper
export const signOutUser = async () => {
  if (!auth) {
    return { success: true };
  }
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error: any) {
    console.error('Error signing out:', error);
    return { success: false, error: error.message };
  }
};

export type { FirebaseUser };

