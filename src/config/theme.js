
import React, { createContext, useContext, useMemo, useState } from 'react';
import { Appearance } from 'react-native';
import { palette, paletteDark } from '../styles/colors';

const ThemeContext = createContext({ theme: 'light', colors: palette, toggle: () => {} });

export const ThemeProvider = ({ children }) => {
  const sys = Appearance.getColorScheme();
  const [theme, setTheme] = useState(sys || 'light');
  const toggle = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  const value = useMemo(() => ({
    theme,
    colors: theme === 'light' ? palette : paletteDark,
    toggle,
  }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

