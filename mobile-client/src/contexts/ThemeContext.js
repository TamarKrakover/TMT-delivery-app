import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import { theme } from '../theme/theme';

const ThemeContext = createContext({
  isDark: false,
  theme: theme.light,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Load saved theme preference from storage on mount
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('app_theme');
        if (savedTheme !== null) {
          setIsDark(savedTheme === 'dark');
        } else {
          // If no preference is saved, use the device's default color scheme
          const colorScheme = Appearance.getColorScheme();
          setIsDark(colorScheme === 'dark');
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark;
      setIsDark(newTheme);
      await AsyncStorage.setItem('app_theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const currentTheme = isDark ? theme.dark : theme.light;

  return (
    <ThemeContext.Provider value={{ isDark, theme: currentTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
