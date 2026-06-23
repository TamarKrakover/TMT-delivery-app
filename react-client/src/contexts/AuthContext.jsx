import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  });

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  const updateLastViewedProduct = (product) => {
    if (currentUser && product) {
      if (currentUser.lastViewedProduct === product.id) return;
      const updatedUser = { ...currentUser, lastViewedProduct: product.id };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      localStorage.setItem(`lastViewedProduct_${currentUser.id}`, JSON.stringify(product));
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const userStr = localStorage.getItem('user');
      setCurrentUser(userStr ? JSON.parse(userStr) : null);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, updateLastViewedProduct }}>
      {children}
    </AuthContext.Provider>
  );
};
