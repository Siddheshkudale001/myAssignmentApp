
// src/context/AuthContext.js
import React, { createContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { getUserSession, saveUserSession, clearUserSession } from '../services/session';

export const AuthContext = createContext({
  user: null,
  loading: true,
  setUser: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = null;

    (async () => {
      const cached = await getUserSession();
      if (cached) {
        setUser(cached);
        setLoading(false);
      }

      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (!firebaseUser) {
          setUser(null);
          await clearUserSession();
          setLoading(false);
          return;
        }

        const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
        const data = snap.data();

        const appUser = {
          uid: firebaseUser.uid,
          name: data?.name || firebaseUser.displayName || '',
          email: data?.email || firebaseUser.email || '',
          phone: data?.phone || '',
          createdAt: data?.createdAt || null,
        };

        setUser(appUser);
        await saveUserSession(appUser);
        setLoading(false);
      });
    })();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}