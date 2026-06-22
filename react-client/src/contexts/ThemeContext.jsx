import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  // Load user-specific theme when they log in
  useEffect(() => {
    if (currentUser) {
      const saved = localStorage.getItem(`theme_${currentUser.id}`);
      setDarkMode(saved === 'dark');
    } else {
      setDarkMode(false);
    }
  }, [currentUser]);

  // Apply to body globally
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newVal = !prev;
      if (currentUser) {
        localStorage.setItem(`theme_${currentUser.id}`, newVal ? 'dark' : 'light');
      }
      return newVal;
    });
  };
  const toggleTheme = toggleDarkMode;

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, toggleTheme, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
