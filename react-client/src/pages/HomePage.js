import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CategoryFilters from '../components/restaurant/CategoryFilters';
import RestaurantList from '../components/restaurant/RestaurantList';
import HeroBanner from '../components/layout/HeroBanner';
import RestaurantFormModal from '../components/modals/RestaurantFormModal';
import { restaurantService } from '../services/restaurantService';
import mockRestaurants from '../data/restaurants.json';
import { calculateDistance } from '../utils/distance';
import { FiPlus } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useModal } from '../hooks/useModal';
import './HomePage.css';

const HomePage = () => {
  const { currentUser } = useAuth();
  const { darkMode } = useTheme();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const addRestModal = useModal();

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        setLoading(true);
        if (searchQuery.trim() === '') {
          const data = await restaurantService.getAll();
          setRestaurants(data);
        } else {
          const data = await restaurantService.search(searchQuery);
          const matchedRestaurants = data.filter(item => item.location !== undefined || item.address !== undefined);
          setRestaurants(matchedRestaurants);
        }
      } catch (err) {
        console.error("Failed to fetch restaurants:", err);
        setRestaurants(mockRestaurants);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, [searchQuery]);

  const handleAddRestaurantSubmit = async (form) => {
    if (!form.name) {
      addRestModal.setError('Name is required.');
      return;
    }
    try {
      await restaurantService.create(form);
      addRestModal.closeModal();
      
      const data = await restaurantService.getAll();
      setRestaurants(data);
    } catch (err) {
      addRestModal.setError(err.message || 'Failed to create restaurant.');
    }
  };

  const myRestaurants = currentUser && (currentUser.role === 'owner' || currentUser.isAdmin)
    ? restaurants.filter(r => r.creatorId === currentUser.id).reverse()
    : [];

  const nearbyRestaurants = currentUser?.location
    ? restaurants.filter(r => {
        if (!r.location) return false;
        const dist = calculateDistance(currentUser.location, r.location);
        return dist !== null && dist <= 5;
      }).sort((a, b) => {
        const distA = calculateDistance(currentUser.location, a.location);
        const distB = calculateDistance(currentUser.location, b.location);
        return distA - distB;
      })
    : [];

  const displayedRestaurants = restaurants.filter(r => 
    selectedCategory === 'All' || 
    (r.category && r.category.toLowerCase() === selectedCategory.toLowerCase())
  ).sort((a, b) => {
    if (!currentUser?.location) return 0;
    const distA = a.location ? calculateDistance(currentUser.location, a.location) : Infinity;
    const distB = b.location ? calculateDistance(currentUser.location, b.location) : Infinity;
    return distA - distB;
  });

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      <Navbar onSearch={setSearchQuery} />
      
      {/* Time-based dynamic hero banner */}
      <HeroBanner />

      <section className="category-section">
        {currentUser && (currentUser.role === 'owner' || currentUser.isAdmin) && (
          <div className="admin-actions-bar">
            <button className="btn-primary add-restaurant-btn" onClick={() => addRestModal.openModal()}>
              <FiPlus /> Add Restaurant
            </button>
          </div>
        )}

        {currentUser && (currentUser.role === 'owner' || currentUser.isAdmin) && (
          <div className="special-list-container">
            <h2 className="section-title">My Restaurants</h2>
            {myRestaurants.length > 0 ? (
              <RestaurantList restaurants={myRestaurants} />
            ) : (
              <p className="empty-message">You haven't added any restaurants yet.</p>
            )}
          </div>
        )}

        {currentUser?.location && (
          <div className="special-list-container">
            <h2 className="section-title">What's there to eat nearby?</h2>
            {nearbyRestaurants.length > 0 ? (
              <RestaurantList restaurants={nearbyRestaurants} />
            ) : (
              <p className="empty-message">We couldn't find any restaurants within 5km of your location.</p>
            )}
          </div>
        )}

        <h2 className="category-section-title" style={{marginTop: '40px'}}>Categories</h2>
        <CategoryFilters 
          selectedCategory={selectedCategory} 
          onCategorySelect={setSelectedCategory} 
        />
      </section>

      <main className="home-main">
        <div className="home-header-row">
          <h2 className="section-title">
            {selectedCategory} Restaurants {searchQuery && `matching "${searchQuery}"`}
          </h2>
        </div>

        {loading ? (
          <div className="loading">Loading restaurants...</div>
        ) : (
          <RestaurantList restaurants={displayedRestaurants} />
        )}
      </main>

      <Footer />

      {addRestModal.isOpen && (
        <RestaurantFormModal
          title="Add Restaurant"
          onSubmit={handleAddRestaurantSubmit}
          onClose={addRestModal.closeModal}
          error={addRestModal.error}
        />
      )}
    </div>
  );
};

export default HomePage;
