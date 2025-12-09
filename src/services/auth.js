
// src/services/auth.js
import { auth, db } from '../firebase/config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';

// --- SIGN UP (you already have this) ---
export async function signUpWithEmail({ name, email, password, phone }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const uid = cred.user.uid;

  await setDoc(doc(db, 'users', uid), {
    name,
    email,
    phone: phone || '',
    createdAt: serverTimestamp(),
  });

  return { uid, name, email, phone: phone || '' };
}

// --- SIGN IN (add this) ---
export async function signInWithEmail({ email, password }) {
  // 1) Sign in via Firebase Auth
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const uid = cred.user.uid;

  // 2) Try to load Firestore profile (optional but useful)
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);

  // If profile doesn’t exist (e.g., created externally), create a minimal one
  if (!snap.exists()) {
    await setDoc(userRef, {
      name: cred.user.displayName || '',
      email: cred.user.email || email,
      phone: '',
      createdAt: serverTimestamp(),
    });
  }

  const data = snap.data() || {
    name: cred.user.displayName || '',
    email: cred.user.email || email,
    phone: '',
    createdAt: null,
  };

  return {
    uid,
    name: data.name,
    email: data.email,
    phone: data.phone,
    createdAt: data.createdAt,
  };
}