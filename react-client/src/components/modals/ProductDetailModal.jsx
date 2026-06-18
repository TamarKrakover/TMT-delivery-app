import React, { useEffect } from 'react';
import { FiX } from '../../components/common/Icons';
import { useCart } from '../../contexts/CartContext';
import request from '../../services/api';

const ProductDetailModal = ({ product, restaurant, onClose }) => {
  const { addToCart } = useCart();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // Trigger product view to log interaction on the backend
    if (product && restaurant) {
      request(`/api/restaurants/${restaurant.id}/products/${product.id}`).catch(() => {});
    }
    
    return () => { document.body.style.overflow = 'unset'; };
  }, [product, restaurant]);

  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><FiX /></button>
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
