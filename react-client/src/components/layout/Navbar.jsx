import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSun, FiMoon } from 'react-icons/fi';
import SearchBar from '../search/SearchBar';
import logo from '../../logoTMT.svg';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './Navbar.css';

const Navbar = ({ onSearch }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
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

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={handleLogoClick}>
        <img src={logo} alt="Logo" className="logo" />
      </div>
      
      <div className="navbar-search">
        {onSearch && <SearchBar onSearch={onSearch} />}
      </div>
      
      <div className="navbar-actions">
        {currentUser ? (
          <button className="btn-outline">Hi, {currentUser.name}</button>
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
