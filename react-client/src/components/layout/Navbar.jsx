import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../contexts/ThemeContext';
import SearchBar from '../search/SearchBar';
import logo from '../../logoTMT.svg';
import './Navbar.css';

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate('/')}>
        <img src={logo} alt="Logo" className="logo" />
      </div>
      
      <div className="navbar-search">
        <SearchBar />
      </div>
      
      <div className="navbar-actions">
        {user ? (
          <button className="btn-outline">Hi, {user.name}</button>
        ) : (
          <button className="btn-outline" onClick={() => navigate('/login')}>Sign in</button>
        )}
        
        <button 
          className="theme-toggle-btn" 
          onClick={toggleDarkMode}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
