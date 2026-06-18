import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import request from '../../services/api';
import { FiX, FiShoppingCart, FiMinus, FiPlus, FiTrash2, FiCheckCircle, FiAlertTriangle } from '../../components/common/Icons';
import './SidebarCart.css';

const SidebarCart = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    cartItems,
    cartRestaurant,
    isCartOpen,
    conflictItem,
    setCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    confirmConflict,
    cancelConflict,
    checkout
  } = useCart();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isCartOpen || conflictItem) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isCartOpen, conflictItem]);

  const [cartCalculation, setCartCalculation] = useState({ totalPrice: 0, items: [] });
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0 || !cartRestaurant) {
      setCartCalculation({ totalPrice: 0, items: [] });
      return;
    }

    const productIds = cartItems.reduce((acc, item) => {
      for (let i = 0; i < item.quantity; i++) {
        acc.push(item.id);
      }
      return acc;
    }, []);

    setIsCalculating(true);
    request('/api/orders/calculate', {
      method: 'POST',
      body: JSON.stringify({ restaurantId: cartRestaurant.id, productIds })
    })
    .then(data => {
      if (data) setCartCalculation(data);
      setIsCalculating(false);
    })
    .catch(err => {
      console.error('Calculation error:', err);
      setIsCalculating(false);
    });
  }, [cartItems, cartRestaurant, isCartOpen]);

  const handleCheckout = async () => {
    if (!currentUser) {
      setCartOpen(false);
      navigate('/login');
      return;
    }

    if (cartItems.length === 0 || !cartRestaurant) return;

    try {
      setLoading(true);
      setError('');

      await checkout();
      setSuccess(true);
    } catch (err) {
      console.error('Checkout failed:', err);
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccess = () => {
    setSuccess(false);
    clearCart();
    setCartOpen(false);
  };

  const getItemPrice = (itemId) => {
    return cartCalculation.items.filter(i => i.id === itemId).reduce((sum, i) => sum + (i.price || 0), 0);
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className={`cart-overlay ${isCartOpen ? 'open' : ''}`} 
        onClick={() => !loading && !success && setCartOpen(false)}
      />

      {/* Slide-out Sidebar */}
      <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-container">
          {/* Header */}
          <div className="cart-header">
            <div className="cart-header-title-section">
              <h3 className="cart-header-title">
                <FiShoppingCart /> Your Cart
              </h3>
              {cartRestaurant && (
                <span className="cart-header-restaurant">
                  From {cartRestaurant.name}
                </span>
              )}
            </div>
            <button 
              className="cart-close-btn" 
              onClick={() => !loading && !success && setCartOpen(false)}
              aria-label="Close cart"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="cart-body">
            {error && (
              <div className="cart-error-message">
                {error}
              </div>
            )}

            {cartItems.length === 0 ? (
              <div className="cart-empty-state">
                <FiShoppingCart className="cart-empty-icon" />
                <h4 className="cart-empty-title">Your cart is empty</h4>
                <p className="cart-empty-text">
                  Add delicious meals from a restaurant to start your order!
                </p>
                <button 
                  className="btn-primary" 
                  onClick={() => {
                  setCartOpen(false);
                  navigate('/');
                }}
                >
                  Browse Restaurants
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-item-details">
                    <h4 className="cart-item-name">{item.name}</h4>
                    <span className="cart-item-price">
                      ${getItemPrice(item.id).toFixed(2)}
                    </span>
                  </div>
                  <div className="cart-item-actions">
                    <div className="quantity-selector">
                      <button 
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <FiMinus />
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button 
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <FiPlus />
                      </button>
                    </div>
                    <button 
                      className="cart-item-remove-btn"
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Remove item"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="cart-footer">
              <div className="cart-summary-row">
                <span className="cart-summary-label">Total Sum</span>
                <span className="cart-summary-value">${(cartCalculation.totalPrice || 0).toFixed(2)}</span>
              </div>
              <button 
                className={`btn-primary btn-checkout ${loading ? 'disabled' : ''}`}
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? (
                  'Placing Order...'
                ) : currentUser ? (
                  'Place Order'
                ) : (
                  'Sign in to Order'
                )}
              </button>
            </div>
          )}

          {/* Order Success Overlay */}
          {success && (
            <div className="cart-success-overlay">
              <div className="success-icon-wrapper">
                <FiCheckCircle />
              </div>
              <h3 className="success-title">Order Placed!</h3>
              <p className="success-text">
                Your order from <strong>{cartRestaurant?.name}</strong> has been successfully placed and is being prepared.
              </p>
              <button className="btn-primary btn-block" onClick={handleCloseSuccess}>
                Awesome
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Conflict Modal Overlay */}
      {conflictItem && (
        <div className="conflict-modal-overlay">
          <div className="conflict-modal">
            <div className="conflict-modal-header">
              <FiAlertTriangle size={24} />
              <h3 className="conflict-modal-title">Clear your cart?</h3>
            </div>
            <p className="conflict-modal-text">
              You already have items from <strong>{cartRestaurant?.name}</strong> in your cart. 
              Would you like to clear your current cart and start a new order from <strong>{conflictItem.restaurant.name}</strong>?
            </p>
            <div className="conflict-modal-actions">
              <button className="btn-outline conflict-btn" onClick={cancelConflict}>
                Cancel
              </button>
              <button className="btn-primary conflict-btn-danger" onClick={confirmConflict}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarCart;
