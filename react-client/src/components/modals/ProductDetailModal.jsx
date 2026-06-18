import React, { useEffect } from 'react';
import { FiX } from '../../components/common/Icons';
import { useCart } from '../../contexts/CartContext';
import request from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const ProductDetailModal = ({ product, restaurant, onClose }) => {
  const { addToCart } = useCart();
  const { currentUser } = useAuth();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // Trigger product view to log interaction on the backend
    if (product && restaurant) {
      request(`/api/restaurants/${restaurant.id}/products/${product.id}`).catch(() => {});
      
      // Save last viewed product for the current user
      if (currentUser) {
        localStorage.setItem(`lastViewedProduct_${currentUser.id}`, JSON.stringify(product));
      }
    }
    
    return () => { document.body.style.overflow = 'unset'; };
  }, [product, restaurant, currentUser]);

  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><FiX /></button>
        {product.image ? (
          <div 
            className="product-modal-image"
            style={{ backgroundImage: `url(${product.image})` }} 
          />
        ) : (
          <div className="product-modal-no-image">
            No image available for this product
          </div>
        )}
        <h2 className="modal-title">{product.name}</h2>
        <div className="product-modal-price">${parseFloat(product.price).toFixed(2)}</div>
        <p className="product-modal-desc">{product.description || 'No description available.'}</p>
        <button
          className="btn-primary btn-block"
          onClick={() => {
            addToCart(product, restaurant);
            onClose();
          }}
        >
          Add to Order
        </button>
      </div>
    </div>
  );
};

export default ProductDetailModal;
