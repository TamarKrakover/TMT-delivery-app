import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import { restaurantService } from '../services/restaurantService';
import mockRestaurants from '../data/restaurants.json';
import request from '../services/api';
import './SearchPage.css';
const imageHamburger = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const [restaurants, setRestaurants] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      try {
        setLoading(true);
        const data = await restaurantService.search(query);
        setRestaurants(data.restaurants || []);
        setProducts(data.products || []);
      } catch (err) {
        console.error("Search failed:", err);
        // Fallback search locally in mockRestaurants on error
        const lower = query.toLowerCase();
        const matched = mockRestaurants.filter(r =>
          r.name.toLowerCase().includes(lower) ||
          (r.description && r.description.toLowerCase().includes(lower))
        );
        setRestaurants(matched);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  // Helper to find restaurant name by ID for dishes list
  const getRestaurantName = (rId) => {
    const found = mockRestaurants.find(r => r.id === rId);
    return found ? found.name : 'Restaurant';
  };

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      <Navbar />
      <main className="search-main">
        <h2 className="search-title">Search results for "{query}"</h2>
        
        {loading ? (
          <div className="search-loading">Searching...</div>
        ) : (
          <div>
            {/* --- Restaurants Section (Horizontal Scroll) --- */}
            <div className="search-section">
              <div className="search-section-header">
                <h3 className="search-section-title">Restaurants and stores</h3>
              </div>
              
              {restaurants.length === 0 ? (
                <p className="search-no-results">No restaurants match your search.</p>
              ) : (
                <div className="search-restaurants-scroll">
                  {restaurants.map(r => (
                    <div key={r.id} className="search-restaurant-card-wrapper">
                      <RestaurantCard
                        name={r.name}
                        category={r.category}
                        address={r.address}
                        rating={r.rating || "5.0"}
                        deliveryTime={r.deliveryTime || "20-30"}
                        imageKey={r.imageKey}
                        onClick={() => navigate(`/restaurant/${r.id}`)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* --- Products / Related Items Section --- */}
            <div>
              <div className="search-section-header">
                <h3 className="search-section-title">Related items</h3>
              </div>

              {products.length === 0 ? (
                <p className="search-no-results">No dishes match your search.</p>
              ) : (
                <div className="search-related-grid">
                  {products.map(p => (
                    <div 
                      key={p.id} 
                      className="related-product-card" 
                      onClick={() => {
                        request(`/api/restaurants/${p.restaurantId}/products/${p.id}`).catch(() => {});
                        navigate(`/restaurant/${p.restaurantId}`);
                      }}
                    >
                      <div className="related-product-info">
                        <div>
                          <span className="related-product-price">₪{p.price}.00</span>
                          <h4 className="related-product-name">{p.name}</h4>
                          <p className="related-product-restaurant">
                            {getRestaurantName(p.restaurantId)}
                          </p>
                        </div>
                        <div className="related-product-meta">
                          <span>🚴 ₪0.00</span>
                          <span>•</span>
                          <span>30-40 min</span>
                        </div>
                      </div>
                      <div className="related-product-image-wrapper">
                        <img 
                          src={imageHamburger} 
                          alt={p.name} 
                          className="related-product-image" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage;
