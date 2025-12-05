
// navigation/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({
  isAuth: false,
  checking: true,
  signIn: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      setChecking(true);
      // TODO: read token/session from storage or API
      await new Promise((r) => setTimeout(r, 400));
      setIsAuth(false);
      setChecking(false);
    };
    bootstrap();
  }, []);

  const signIn = async () => {
    // TODO: store token/session
    setIsAuth(true);
  };

  const signOut = async () => {
    // TODO: clear token/session
    setIsAuth(false);
  };

  return (
    <AuthContext.Provider value={{ isAuth, checking, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
