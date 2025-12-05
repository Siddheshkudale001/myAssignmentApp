
import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import { makeTheme } from '../styles/theme';

const ThemeContext = createContext({ theme: makeTheme(), setMode: () => {} });

export const ThemeProvider = ({ children, initialMode }) => {
  const [mode, setMode] = useState(initialMode ?? (Appearance.getColorScheme() || 'light'));

  // Optional: sync with system changes
  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      if (!initialMode) setMode(colorScheme || 'light');
    });
    return () => sub?.remove?.();
  }, [initialMode]);

  const value = useMemo(() => ({ theme: makeTheme(mode), setMode }), [mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
