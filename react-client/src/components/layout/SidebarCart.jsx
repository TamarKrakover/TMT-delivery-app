import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { orderService } from '../../services/orderService';
import { FiX, FiShoppingCart, FiMinus, FiPlus, FiTrash2, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
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
    cancelConflict
  } = useCart();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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

      // Flatten items into array of product IDs corresponding to quantity
      const productIds = cartItems.reduce((acc, item) => {
        for (let i = 0; i < item.quantity; i++) {
          acc.push(item.id);
        }
        return acc;
      }, []);

      await orderService.create(cartRestaurant.id, productIds);
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

  const subtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);

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
                      ${(parseFloat(item.price) * item.quantity).toFixed(2)}
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
                <span className="cart-summary-value">${subtotal.toFixed(2)}</span>
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
