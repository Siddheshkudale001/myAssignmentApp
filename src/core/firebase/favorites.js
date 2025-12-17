import { doc, setDoc, deleteDoc, getDocs, collection } from 'firebase/firestore';
import { db } from './firestore';

/**
 * users/{uid}/favorites/{productId}
 */

export const addFavorite = async (uid, productId) => {
  if (!uid) throw new Error('UID missing');

  const ref = doc(db, 'users', uid, 'favorites', String(productId));

  await setDoc(ref, {
    productId,
    createdAt: Date.now(),
  });
};

export const removeFavorite = async (uid, productId) => {
  if (!uid) throw new Error('UID missing');

  const ref = doc(db, 'users', uid, 'favorites', String(productId));
  await deleteDoc(ref);
};

export const fetchFavorites = async (uid) => {
  if (!uid) return [];

  const snap = await getDocs(
    collection(db, 'users', uid, 'favorites')
  );

  return snap.docs.map(doc => Number(doc.id));
};
