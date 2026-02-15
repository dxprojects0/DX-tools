import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import {
  GoogleAuthProvider,
  RecaptchaVerifier,
  User,
  getAuth,
  signInWithPhoneNumber,
  signInWithPopup,
} from 'firebase/auth';
import { doc, getFirestore, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyC2v7H63bKL7Q-Iwob568xS4HQtX2T_C00',
  authDomain: 'dxtoolz.firebaseapp.com',
  projectId: 'dxtoolz',
  storageBucket: 'dxtoolz.firebasestorage.app',
  messagingSenderId: '913198786720',
  appId: '1:913198786720:web:8c0f7ea7f1f1fa6fa681c5',
  measurementId: 'G-K9JRPR9NKM',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

isSupported()
  .then((supported) => {
    if (supported) getAnalytics(app);
  })
  .catch(() => {
    // no-op
  });

export const signInWithGoogle = async (): Promise<User> => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

export const sendPhoneOtp = async (phoneNumber: string, containerId: string) => {
  const verifier = new RecaptchaVerifier(auth, containerId, { size: 'invisible' });
  return signInWithPhoneNumber(auth, phoneNumber, verifier);
};

export const verifyPhoneOtp = async (confirmation: any, code: string): Promise<User> => {
  const result = await confirmation.confirm(code);
  return result.user;
};

export const syncUserDataToFirestore = async (uid: string, snapshot: unknown) => {
  const now = new Date();
  const dateKey = now.toISOString().split('T')[0];
  await setDoc(doc(db, 'users', uid, 'dailyReports', dateKey), {
    syncedAt: now.toISOString(),
    reportDate: dateKey,
    data: snapshot,
  }, { merge: true });

  await setDoc(doc(db, 'users', uid, 'snapshots', 'latest'), {
    syncedAt: now.toISOString(),
    data: snapshot,
  }, { merge: true });
};
