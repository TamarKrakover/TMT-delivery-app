import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserSession, setUserSession, clearUserSession, setLastViewedProduct } from '../services/api';

const AuthContext = createContext({
  currentUser: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  updateLastViewedProduct: async () => {},
  refreshCurrentUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUserSession = async () => {
    try {
      const session = await getUserSession();
      setCurrentUser(session);
    } catch (error) {
      console.error('Failed to load user session:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserSession();
  }, []);

  const login = async (fullUserData) => {
    await setUserSession(fullUserData);
    setCurrentUser(fullUserData);
  };

  const logout = async () => {
    await clearUserSession();
    setCurrentUser(null);
  };

  const updateLastViewedProduct = async (product) => {
    if (currentUser && product) {
      const pid = product.id || product._id;
      if (currentUser.lastViewedProduct === pid) return;
      const updatedUser = { ...currentUser, lastViewedProduct: pid };
      await setUserSession(updatedUser);
      setCurrentUser(updatedUser);
      await setLastViewedProduct(currentUser.id, product);
    }
  };

  const refreshCurrentUser = async (fetchUserDetailsFunc) => {
    if (currentUser?.id) {
      try {
        const freshData = await fetchUserDetailsFunc(currentUser.id);
        if (freshData) {
          await setUserSession(freshData);
          setCurrentUser(freshData);
        }
      } catch (error) {
        console.error('Failed to refresh user details:', error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        login,
        logout,
        updateLastViewedProduct,
        refreshCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
