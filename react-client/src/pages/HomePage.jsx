import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CategoryFilters from '../components/restaurant/CategoryFilters';
import RestaurantList from '../components/restaurant/RestaurantList';
import HeroBanner from '../components/layout/HeroBanner';
import RestaurantFormModal from '../components/modals/RestaurantFormModal';
import CategoryFormModal from '../components/modals/CategoryFormModal';
import { restaurantService } from '../services/restaurantService';
import { categoryService } from '../services/categoryService';
import { productService } from '../services/productService';
import { calculateDistance } from '../utils/distance';
import { FiPlus } from '../components/common/Icons';
import { useAuth } from '../contexts/AuthContext';
import { useModal } from '../hooks/useModal';
import MenuItem from '../components/restaurant/MenuItem';
import ProductDetailModal from '../components/modals/ProductDetailModal';
import './HomePage.css';
import './RestaurantPage.css';

const HomePage = () => {
  const { currentUser } = useAuth();
  const { darkMode } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastViewedProduct, setLastViewedProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsStatus, setRecommendationsStatus] = useState('idle');

  const addRestModal = useModal();
  const addCatModal = useModal();
  const productDetailModal = useModal();

  const fetchCategories = async () => {
    try {
      const cats = await categoryService.getAll();
      setCategories(cats);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const loadRecommendations = async () => {
      if (currentUser) {
        if (!currentUser.lastViewedProduct) {
          setLastViewedProduct(null);
          setRecommendations([]);
          setRecommendationsStatus('idle');
          return;
        }

        // Try to load from localStorage first for instant display
        let productObj = null;
        const stored = localStorage.getItem(`lastViewedProduct_${currentUser.id}`);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed && parsed.id === currentUser.lastViewedProduct) {
              productObj = parsed;
            }
          } catch (e) {
            console.error("Failed to parse stored product details", e);
          }
        }

        // If not found in localStorage or ID mismatch, load from backend
        if (!productObj) {
          try {
            productObj = await productService.getByGlobalId(currentUser.lastViewedProduct);
          } catch (e) {
            console.error("Failed to fetch global product details", e);
          }
        }
        setLastViewedProduct(productObj);

        try {
          setRecommendationsStatus('loading');
          const data = await productService.getRecommendations(currentUser.id, currentUser.lastViewedProduct);
          setRecommendations(data || []);
          setRecommendationsStatus('success');
        } catch (e) {
          console.error("Failed to load recommendations:", e);
          setRecommendations([]);
          setRecommendationsStatus('error');
        }
      } else {
        setLastViewedProduct(null);
        setRecommendations([]);
        setRecommendationsStatus('idle');
      }
    };

    loadRecommendations();
  }, [currentUser, productDetailModal.isOpen]);

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
        setRestaurants([]);
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
      fetchCategories(); // Refresh category counts
    } catch (err) {
      addRestModal.setError(err.message || 'Failed to create restaurant.');
    }
  };

  const handleAddCategorySubmit = async (form) => {
    if (!form.name) {
      addCatModal.setError('Name is required.');
      return;
    }
    try {
      await categoryService.create(form);
      addCatModal.closeModal();
      fetchCategories();
    } catch (err) {
      addCatModal.setError(err.response?.data?.message || err.message || 'Failed to create category.');
    }
  };

  const myRestaurants = useMemo(() => {
    if (!currentUser || (currentUser.role !== 'owner' && !currentUser.isAdmin)) return [];
    return restaurants.filter(r => r.creatorId === currentUser.id).reverse();
  }, [restaurants, currentUser]);

  const nearbyRestaurants = useMemo(() => {
    if (!currentUser?.location) return [];
    return restaurants.filter(r => {
      if (!r.location) return false;
      const dist = calculateDistance(currentUser.location, r.location);
      return dist !== null && dist <= 5;
    }).sort((a, b) => {
      const distA = calculateDistance(currentUser.location, a.location);
      const distB = calculateDistance(currentUser.location, b.location);
      return distA - distB;
    });
  }, [restaurants, currentUser?.location]);

  const displayedRestaurants = useMemo(() => {
    return restaurants.filter(r =>
      selectedCategory === 'All' ||
      (r.category && r.category.toLowerCase() === selectedCategory.toLowerCase())
    ).sort((a, b) => {
      if (!currentUser?.location) return 0;
      const distA = a.location ? calculateDistance(currentUser.location, a.location) : Infinity;
      const distB = b.location ? calculateDistance(currentUser.location, b.location) : Infinity;
      return distA - distB;
    });
  }, [restaurants, selectedCategory, currentUser?.location]);

  const displayCategories = useMemo(() => {
    const allCategory = {
      name: 'All',
      image: "/api/uploads/categories/all.webp",
      count: restaurants.length
    };
    return [allCategory, ...categories];
  }, [restaurants.length, categories]);

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

        {currentUser && (
          <div className="special-list-container">
            {!currentUser.lastViewedProduct ? (
              <h2 className="section-title">check out your taste!</h2>
            ) : (
              <>
                <h2 className="section-title">
                  if you liked {lastViewedProduct ? lastViewedProduct.name : '...'} you might also like
                </h2>
                {recommendationsStatus === 'loading' && (
                  <div className="loading">Loading recommendations...</div>
                )}
                {recommendationsStatus === 'success' && recommendations.length > 0 && (
                  <div className="menu-grid" style={{ marginTop: '20px' }}>
                    {recommendations.map((item) => (
                      <MenuItem
                        key={item.product.id}
                        product={item.product}
                        restaurant={item.restaurant}
                        canModify={false}
                        onClick={(p) => productDetailModal.openModal({ ...p, restaurant: item.restaurant })}
                      />
                    ))}
                  </div>
                )}
                {recommendationsStatus === 'success' && recommendations.length === 0 && (
                  <p className="empty-message">No recommended products found.</p>
                )}
                {recommendationsStatus === 'error' && (
                  <p className="empty-message">Failed to load recommendations.</p>
                )}
              </>
            )}
          </div>
        )}

        <div className="category-section-header">
          <h2 className="category-section-title category-section-title-no-margin">Categories</h2>
          {currentUser?.isAdmin && (
            <button className="btn-primary add-restaurant-btn" onClick={() => addCatModal.openModal()}>
              <FiPlus /> Add Category
            </button>
          )}
        </div>
        <CategoryFilters
          categories={displayCategories}
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

      {addCatModal.isOpen && (
        <CategoryFormModal
          onSubmit={handleAddCategorySubmit}
          onClose={addCatModal.closeModal}
          error={addCatModal.error}
        />
      )}

      {productDetailModal.isOpen && (
        <ProductDetailModal
          product={productDetailModal.data}
          restaurant={productDetailModal.data?.restaurant}
          onClose={productDetailModal.closeModal}
        />
      )}
    </div>
  );
};

export default HomePage;
