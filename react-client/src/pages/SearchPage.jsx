import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import MenuItem from '../components/restaurant/MenuItem';
import ProductDetailModal from '../components/modals/ProductDetailModal';
import { restaurantService } from '../services/restaurantService';
import ScrollableRow from '../components/common/ScrollableRow';
import './SearchPage.css';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const [restaurants, setRestaurants] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allRestaurants, setAllRestaurants] = useState([]);
  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      try {
        setLoading(true);
        const [data, allRests] = await Promise.all([
          restaurantService.search(query),
          restaurantService.getAll()
        ]);
        setAllRestaurants(allRests);
        // Separate combined search results by presence of fields (location/address for restaurants, price for products)
        const matchedRestaurants = data.filter(item => item.location !== undefined || item.address !== undefined);
        const matchedProducts = data.filter(item => item.price !== undefined);
        setRestaurants(matchedRestaurants);
        setProducts(matchedProducts);
      } catch (err) {
        console.error("Search failed:", err);
        setRestaurants([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  // Helper to find restaurant by ID for dishes list
  const getRestaurant = (rId) => {
    const found = allRestaurants.find(r => r.id === rId);
    return found || { id: rId, name: 'Unknown Restaurant' };
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
                <ScrollableRow className="search-restaurants-scroll-wrapper">
                  <div className="search-restaurants-scroll">
                  {restaurants.map(r => (
                    <div key={r.id} className="search-restaurant-card-wrapper">
                      <RestaurantCard
                        id={r.id}
                        name={r.name}
                        category={r.category}
                        description={r.description || r.address}
                        image={r.image}
                        onClick={() => navigate(`/restaurant/${r.id}`)}
                      />
                    </div>
                  ))}
                  </div>
                </ScrollableRow>
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
                    <div key={p.id} className="search-restaurant-card-wrapper search-restaurant-card-wrapper-spaced">
                      <MenuItem 
                        product={p} 
                        restaurant={getRestaurant(p.restaurantId)}
                        canModify={false}
                        onClick={() => setSelectedProduct(p)} 
                        showRestaurantName={true}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          restaurant={getRestaurant(selectedProduct.restaurantId)}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default SearchPage;
