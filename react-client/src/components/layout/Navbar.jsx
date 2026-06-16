import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSun, FiMoon, FiShoppingCart } from 'react-icons/fi';
import SearchBar from '../search/SearchBar';
import logo from '../../logoTMT.svg';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useCart } from '../../contexts/CartContext';
import './Navbar.css';

const Navbar = ({ onSearch }) => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleTheme, setDarkMode } = useTheme();
  const { cartItems, toggleCart } = useCart();

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleLogoClick = () => {
    navigate('/');
    if (onSearch) {
      onSearch('');
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    setDarkMode(false);
    setShowLogoutModal(false);
    navigate('/login');
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand" onClick={handleLogoClick}>
        <img src={logo} alt="Logo" className="logo" />
      </div>
      
      <div className="navbar-search">
        {onSearch ? <SearchBar onSearch={onSearch} /> : <SearchBar />}
      </div>
      
      <div className="navbar-actions">
        {currentUser ? (
          <div className="navbar-user-info">
            <div 
              onClick={() => navigate('/profile')} 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              title="View Profile & Order History"
            >
              {currentUser.profilePic ? (
                <img 
                  src={currentUser.profilePic} 
                  alt="Profile" 
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} 
                />
              ) : (
                <div style={{ 
                  width: '32px', height: '32px', borderRadius: '50%', 
                  backgroundColor: 'var(--primary)', color: 'white', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  fontWeight: 'bold', fontSize: '14px' 
                }}>
                  {(currentUser.name || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <span className="navbar-user-name">
                Hi, {currentUser.name}
              </span>
            </div>
            <button className="btn-outline navbar-signout-btn" onClick={handleLogoutClick}>Sign out</button>
          </div>
        ) : (
          <button className="btn-outline" onClick={handleLoginClick}>Sign in</button>
        )}
        
        <button 
          className="cart-toggle-btn"
          onClick={toggleCart}
          title="Open Cart"
        >
          <FiShoppingCart />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>

        {currentUser && (
          <button 
            className="theme-toggle-btn" 
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
        )}
        </div>
      </nav>

      {showLogoutModal && (
        <div className="conflict-modal-overlay">
          <div className="conflict-modal">
            <div className="conflict-modal-header" style={{ color: 'var(--dark)' }}>
              <h3 className="conflict-modal-title">Sign Out</h3>
            </div>
            <p className="conflict-modal-text">
              Are you sure you want to sign out of your account?
            </p>
            <div className="conflict-modal-actions">
              <button className="btn-outline conflict-btn" onClick={cancelLogout}>
                Cancel
              </button>
              <button className="btn-primary conflict-btn-danger" onClick={confirmLogout}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
