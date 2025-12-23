import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  getDocs,
  deleteDoc,
  orderBy,
  query,
  limit,
  onSnapshot,
} from 'firebase/firestore';

import { db } from './config';

/* ---------------- ADD TO HISTORY ---------------- */
export const addToHistory = async (uid, product) => {
  if (!uid || !product?.id) return;

  const ref = doc(db, 'users', uid, 'history', String(product.id));

  await setDoc(ref, {
    productId: product.id,
    title: product.title,
    image: product.image,
    price: product.price,
    viewedAt: serverTimestamp(),
  });
};

/* ---------------- ONE-TIME FETCH (optional use) ---------------- */
export const fetchHistory = async (uid) => {
  if (!uid) return [];

  const q = query(
    collection(db, 'users', uid, 'history'),
    orderBy('viewedAt', 'desc'),
    limit(20)
  );

  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
};

/* ---------------- REAL-TIME SUBSCRIBE ---------------- */
export const subscribeToHistory = (uid, callback) => {
  if (!uid) return () => {};

  const q = query(
    collection(db, 'users', uid, 'history'),
    orderBy('viewedAt', 'desc')
  );

  const unsubscribe = onSnapshot(q, (snap) => {
    const data = snap.docs.map((d) => d.data());
    callback(data);
  });

  return unsubscribe;
};

/* ---------------- CLEAR HISTORY ---------------- */
export const clearHistory = async (uid) => {
  if (!uid) return;

  const snap = await getDocs(
    collection(db, 'users', uid, 'history')
  );

  const deletes = snap.docs.map((docu) =>
    deleteDoc(docu.ref)
  );

  await Promise.all(deletes);
};
