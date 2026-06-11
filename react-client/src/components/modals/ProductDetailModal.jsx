import React from 'react';
import { FiX } from 'react-icons/fi';

const ProductDetailModal = ({ product, onClose }) => {
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
            alert('Added to cart!');
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
