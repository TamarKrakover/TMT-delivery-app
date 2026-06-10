import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CategoryFilters from '../components/restaurant/CategoryFilters';
import RestaurantList from '../components/restaurant/RestaurantList';
import HeroBanner from '../components/layout/HeroBanner';
import { restaurantService } from '../services/restaurantService';
import mockRestaurants from '../data/restaurants.json'; // Static JSON fallback
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch or search restaurants when searchQuery changes
  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        setLoading(true);
        if (searchQuery.trim() === '') {
          // --- Option 1: Call API (Default) ---
          const data = await restaurantService.getAll();
          setRestaurants(data);
          
          // --- Option 2: Use Mock Data (Uncomment to use) ---
          // setRestaurants(mockRestaurants);
        } else {
          // --- Option 1: Call API Search (Default) ---
          const data = await restaurantService.search(searchQuery);
          // Filter matching results to only show restaurants (exclude products from combined search endpoint)
          const matchedRestaurants = data.filter(item => item.address !== undefined);
          setRestaurants(matchedRestaurants);
          
          // --- Option 2: Local Mock Data Search ---
          // const lowerQuery = searchQuery.toLowerCase();
          // const matched = mockRestaurants.filter(r => 
          //   r.name.toLowerCase().includes(lowerQuery) || 
          //   (r.description && r.description.toLowerCase().includes(lowerQuery))
          // );
          // setRestaurants(matched);
        }
      } catch (err) {
        console.error("Failed to fetch restaurants:", err);
        // Fallback to mock data on server error to keep app running
        setRestaurants(mockRestaurants);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, [searchQuery]);

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

  // Filter restaurants by selected category locally
  const displayedRestaurants = restaurants.filter(r => 
    selectedCategory === 'All' || 
    (r.category && r.category.toLowerCase() === selectedCategory.toLowerCase())
  );

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
        {loading ? (
          <div className="loading">Loading restaurants...</div>
        ) : (
          <RestaurantList restaurants={displayedRestaurants} />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
