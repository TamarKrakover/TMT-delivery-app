import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CategoryFilters from '../components/restaurant/CategoryFilters';
import RestaurantList from '../components/restaurant/RestaurantList';
import HeroBanner from '../components/layout/HeroBanner';
import { restaurantService } from '../services/restaurantService';
import mockRestaurants from '../data/restaurants.json'; // Static JSON fallback
import './HomePage.css';

const HomePage = () => {
  const { darkMode } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch restaurants once on mount
  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        setLoading(true);
        const data = await restaurantService.getAll();
        setRestaurants(data);
      } catch (err) {
        console.error("Failed to fetch restaurants:", err);
        // Fallback to mock data on server error to keep app running
        setRestaurants(mockRestaurants);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, []);

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  // Filter restaurants by selected category locally
  const displayedRestaurants = restaurants.filter(r => 
    selectedCategory === 'All' || 
    (r.category && r.category.toLowerCase() === selectedCategory.toLowerCase())
  );

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      <Navbar />
      
      {/* Time-based dynamic hero banner */}
      <HeroBanner />

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
          {selectedCategory} Restaurants
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
