import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import OrderCard from '../components/order/OrderCard';
import { orderService } from '../services/orderService';
import { restaurantService } from '../services/restaurantService';
import RestaurantList from '../components/restaurant/RestaurantList';
import { productService } from '../services/productService';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext';
import { FiClock, FiShoppingBag, FiList } from 'react-icons/fi';
import './UserProfilePage.css';

const UserProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { checkoutTrigger } = useCart();
  const { darkMode } = useTheme();
  
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [productsCache, setProductsCache] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        // Fetch both orders and restaurants in parallel
        const [ordersData, restaurantsData] = await Promise.all([
          orderService.getAll(),
          restaurantService.getAll()
        ]);

        // Sort orders newest first, filtering out active carts (Pending)
        const sortedOrders = ordersData
          .filter(order => order.status !== 'Pending')
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Fetch products for all unique restaurants in orders
        const uniqueRestIds = [...new Set(sortedOrders.map(o => o.restaurantId))];
        const productsPromises = uniqueRestIds.map(id => productService.getByRestaurantId(id).catch(() => []));
        const productsResults = await Promise.all(productsPromises);
        
        const newProductsCache = {};
        uniqueRestIds.forEach((id, index) => {
          newProductsCache[id] = productsResults[index];
        });
        
        setProductsCache(newProductsCache);
        setOrders(sortedOrders);
        setRestaurants(restaurantsData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load your order history.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, checkoutTrigger]);

  // Helper to find restaurant details
  const getRestaurantForOrder = (restaurantId) => {
    return restaurants.find(r => r.id === restaurantId);
  };

  if (!currentUser) {
    return (
      <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
        <Navbar />
        <main className="profile-main">
          <div className="profile-error">Please log in to view your profile.</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      <Navbar />
      
      <main className="profile-main">
        <div className="profile-header">
          {currentUser.profilePic ? (
            <img src={currentUser.profilePic} alt="Profile" className="profile-avatar" />
          ) : (
            <div className="profile-avatar-placeholder">
              {(currentUser.displayName || currentUser.name || 'U').charAt(0).toUpperCase()}
            </div>
          )}
          <div className="profile-info">
            <h1 className="profile-name">{currentUser.displayName || currentUser.name}</h1>
            <p className="profile-email">@{currentUser.username}</p>
          </div>
        </div>

        <section className="order-history-section">
          <h2 className="section-title">
            <FiClock style={{ marginRight: '8px' }} /> 
            Order History
          </h2>

          {loading ? (
            <div className="loading">Loading your orders...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : orders.length === 0 ? (
            <div className="empty-orders">
              <FiShoppingBag className="empty-orders-icon" />
              <h3>No orders yet</h3>
              <p>When you place an order, it will appear here!</p>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  restaurant={getRestaurantForOrder(order.restaurantId)}
                  restaurantProducts={productsCache[order.restaurantId] || []}
                />
              ))}
            </div>
          )}
        </section>

        {(currentUser.role === 'owner' || currentUser.isAdmin || restaurants.some(r => r.creatorId === currentUser.id)) && (
          <section className="order-history-section" style={{ marginTop: '40px' }}>
            <h2 className="section-title">
              <FiList style={{ marginRight: '8px' }} /> 
              My Restaurants
            </h2>
            
            {loading ? (
              <div className="loading">Loading your restaurants...</div>
            ) : restaurants.filter(r => r.creatorId === currentUser.id).length === 0 ? (
              <div className="empty-orders">
                <p>You haven't added any restaurants yet.</p>
              </div>
            ) : (
              <div className="restaurant-list-container">
                {restaurants.filter(r => r.creatorId === currentUser.id).map(rest => {
                  const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=60";
                  const imageMap = {
                    burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
                    pizza: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",
                    sushi: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=80",
                    asian: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80",
                    dessert: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&auto=format&fit=crop&q=80",
                    salad: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80"
                  };
                  const displayImage = rest.image || (rest.imageKey && imageMap[rest.imageKey.toLowerCase()]) || DEFAULT_IMAGE;
                  
                  return (
                    <div 
                      key={rest.id} 
                      className="restaurant-list-card" 
                      onClick={() => navigate(`/restaurant/${rest.id}`)}
                    >
                      <img 
                        src={displayImage} 
                        alt={rest.name} 
                        className="restaurant-list-image"
                      />
                      <div className="restaurant-list-info">
                        <div className="restaurant-list-header">
                          <h3 className="restaurant-list-title">{rest.name}</h3>
                          <span className="restaurant-list-badge">{rest.category}</span>
                        </div>
                        <p className="restaurant-list-desc">{rest.address || rest.description}</p>
                        <div className="restaurant-list-meta">
                          <span className="restaurant-meta-bold">⭐ {rest.rating || '5.0'}</span>
                          <span className="restaurant-meta-bullet">•</span>
                          <span className="restaurant-meta-normal">{rest.deliveryTime || '20-30'} mins</span>
                        </div>
                      </div>
                      <span className="order-status processing restaurant-list-status">Active</span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default UserProfilePage;
