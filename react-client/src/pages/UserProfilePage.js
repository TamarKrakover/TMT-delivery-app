import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import OrderCard from '../components/order/OrderCard';
import { orderService } from '../services/orderService';
import { restaurantService } from '../services/restaurantService';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { FiClock, FiShoppingBag } from 'react-icons/fi';
import './UserProfilePage.css';

const UserProfilePage = () => {
  const { currentUser } = useAuth();
  const { darkMode } = useTheme();
  
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [productsCache, setProductsCache] = useState({});

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

        // Fetch products for each unique restaurant in the orders so we can display item names
        const uniqueRestIds = [...new Set(ordersData.map(o => o.restaurantId))];
        
        // In order to avoid a dependency cycle, import productService here or at top
        const { productService } = await import('../services/productService');
        const productsPromises = uniqueRestIds.map(id => productService.getByRestaurantId(id).catch(() => []));
        const productsResults = await Promise.all(productsPromises);
        
        const newProductsCache = {};
        uniqueRestIds.forEach((id, index) => {
          newProductsCache[id] = productsResults[index];
        });
        setProductsCache(newProductsCache);

        // Sort orders newest first
        const sortedOrders = ordersData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
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
  }, [currentUser]);

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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>
              <FiClock style={{ marginRight: '8px' }} /> 
              Order History
            </h2>
            {!loading && orders.length > 0 && (
              <div style={{ 
                fontSize: '1.05rem', 
                fontWeight: 'bold', 
                color: 'var(--primary)', 
                backgroundColor: 'var(--primary-light, #eef2ff)', 
                padding: '8px 16px', 
                borderRadius: '20px',
                border: '1px solid var(--primary)'
              }}>
                Total Spent: ${orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0).toFixed(2)}
              </div>
            )}
          </div>

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
      </main>

      <Footer />
    </div>
  );
};

export default UserProfilePage;
