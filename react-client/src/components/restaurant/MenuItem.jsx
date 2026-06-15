import React from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useCart } from '../../contexts/CartContext';

const MenuItem = ({ product, restaurant, canModify, onClick, onEdit, onDelete }) => {
  const { addToCart } = useCart();

  return (
    <div className="menu-item-card" onClick={() => onClick(product)}>
      <div className="menu-item-info">
        <div className="menu-item-name-row">
          <h3 className="menu-item-name">{product.name}</h3>
          <span className="menu-item-price">${parseFloat(product.price).toFixed(2)}</span>
        </div>
        <p className="menu-item-desc">{product.description || 'No description provided.'}</p>
      </div>

      <div className="menu-item-actions-row">
        <button 
          className="btn-add-menu" 
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product, restaurant);
          }}
        >
          Add to Cart
        </button>

        {canModify && (
          <div className="item-action-btns">
            <button
              className="btn-icon edit"
              onClick={(e) => onEdit(product, e)}
              title="Edit Item"
            >
              <FiEdit size={14} />
            </button>
            <button
              className="btn-icon delete"
              onClick={(e) => onDelete(product.id, e)}
              title="Delete Item"
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuItem;
