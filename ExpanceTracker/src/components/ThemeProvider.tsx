// ThemeContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark';

const ThemeContext = createContext<{
  theme: ThemeMode;
  toggleTheme: () => void;
}>({
  theme: 'light',
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemTheme = useColorScheme();
  const [overrideTheme, setOverrideTheme] = useState<ThemeMode | null>(null);

  const toggleTheme = () => {
    setOverrideTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const theme: ThemeMode = overrideTheme ?? (systemTheme === 'dark' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
