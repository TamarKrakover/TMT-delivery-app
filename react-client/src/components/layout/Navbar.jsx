import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import SearchBar from '../search/SearchBar';
import logo from '../../logoTMT.svg';
import './Navbar.css';

const Navbar = ({ onSearch, user, onLoginClick, darkMode, onToggleDarkMode, onLogoClick }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={onLogoClick}>
        <img src={logo} alt="Logo" className="logo" />
      </div>
      
      <div className="navbar-search">
        <SearchBar onSearch={onSearch} />
      </div>
      
      <div className="navbar-actions">
        {user ? (
          <button className="btn-outline">Hi, {user.name}</button>
        ) : (
          <button className="btn-outline" onClick={onLoginClick}>Sign in</button>
        )}
        
        <button 
          className="theme-toggle-btn" 
          onClick={onToggleDarkMode}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
