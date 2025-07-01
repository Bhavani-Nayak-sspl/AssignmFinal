import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = 'APP_THEME';

const ThemeContext = createContext<{
  theme: ThemeMode;
  toggleTheme: () => void;
}>({
  theme: 'light',
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemTheme = useColorScheme(); // system theme ('light' or 'dark')
  const [overrideTheme, setOverrideTheme] = useState<ThemeMode | null>(null);

  // Load stored theme on mount
  useEffect(() => {
    const loadStoredTheme = async () => {
      const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (storedTheme === 'light' || storedTheme === 'dark') {
        setOverrideTheme(storedTheme);
      }
    };
    loadStoredTheme();
  }, []);

  // Toggle and persist theme
  const toggleTheme = async () => {
    const newTheme = (overrideTheme ?? systemTheme) === 'dark' ? 'light' : 'dark';
    setOverrideTheme(newTheme);
    await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  // Use override theme if set, else system theme
  const theme: ThemeMode = overrideTheme ?? (systemTheme === 'dark' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
