import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage or default to false
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    
    // Apply globally to body for global CSS usage
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Keep both names for backwards compatibility during merge
  const toggleDarkMode = () => setDarkMode(prev => !prev);
  const toggleTheme = toggleDarkMode;

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, toggleTheme }}>
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
