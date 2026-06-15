import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RestaurantPage from './pages/RestaurantPage';
import SearchPage from './pages/SearchPage';
import UserProfilePage from './pages/UserProfilePage';
import ProtectedRoute from './components/auth/ProtectedRoute';

import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import SidebarCart from './components/layout/SidebarCart';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <Router>
            <SidebarCart />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/restaurant/:id" element={<RestaurantPage />} />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <UserProfilePage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Router>
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
