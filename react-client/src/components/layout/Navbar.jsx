import React from 'react';
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
  const { darkMode, toggleTheme } = useTheme();
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

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  return (
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
            <span className="navbar-user-name" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }} title="View Order History">
              Hi, {currentUser.name}
            </span>
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

        <button 
          className="theme-toggle-btn" 
          onClick={toggleTheme}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
