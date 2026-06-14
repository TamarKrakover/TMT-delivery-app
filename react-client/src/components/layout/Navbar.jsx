import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSun, FiMoon } from 'react-icons/fi';
import SearchBar from '../search/SearchBar';
import logo from '../../logoTMT.svg';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import './Navbar.css';

const Navbar = ({ onSearch }) => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

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
    navigate('/');
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
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontWeight: 600 }}>Hi, {currentUser.name}</span>
            <button className="btn-outline" onClick={handleLogoutClick} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Sign out</button>
          </div>
        ) : (
          <button className="btn-outline" onClick={handleLoginClick}>Sign in</button>
        )}
        
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
