import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CategoryFilters from '../components/restaurant/CategoryFilters';
import RestaurantList from '../components/restaurant/RestaurantList';
import HeroBanner from '../components/layout/HeroBanner';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleSearch = (query) => {
    setSearchQuery(query);
    console.log('Searching for:', query);
  };

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogoClick = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      <Navbar 
        onSearch={handleSearch} 
        darkMode={darkMode} 
        onToggleDarkMode={handleToggleDarkMode} 
        onLogoClick={handleLogoClick}
        onLoginClick={handleLoginClick}
      />
      
      {/* Time-based dynamic hero banner */}
      <HeroBanner darkMode={darkMode} />

      {/* Categories Section */}
      <section className="category-section">
        <h2 className="category-section-title">Categories</h2>
        <CategoryFilters 
          selectedCategory={selectedCategory} 
          onCategorySelect={handleCategoryClick} 
        />
      </section>

      <main className="home-main">
        <h2 className="section-title">
          {selectedCategory} Restaurants {searchQuery && `matching "${searchQuery}"`}
        </h2>
        <RestaurantList />
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
