import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiCheck, FiX } from '../../components/common/Icons';
import { useCart } from '../../contexts/CartContext';

const MenuItem = ({ product, restaurant, canModify, onClick, onEdit, onDelete }) => {
  const { addToCart } = useCart();
  const [isDeleting, setIsDeleting] = useState(false);

  const hasImage = !!product.image;

  return (
    <div className="menu-item-card" onClick={() => !isDeleting && onClick(product)}>
      {hasImage ? (
        <div className="menu-item-image" style={{ backgroundImage: `url(${product.image})` }}></div>
      ) : (
        <div className="menu-item-no-image">
          <span>No image available for this product</span>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
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
            if (!isDeleting) addToCart(product, restaurant);
          }}
          disabled={isDeleting}
        >
          Add to Cart
        </button>

        {canModify && (
          <div className="item-action-btns">
            {isDeleting ? (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'var(--white)', padding: '2px 8px', borderRadius: '20px', boxShadow: 'var(--shadow-sm)' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--danger)' }}>Delete?</span>
                <button
                  className="btn-icon delete"
                  onClick={(e) => { e.stopPropagation(); onDelete(product.id, e); setIsDeleting(false); }}
                  title="Confirm Delete"
                >
                  <FiCheck size={14} />
                </button>
                <button
                  className="btn-icon"
                  onClick={(e) => { e.stopPropagation(); setIsDeleting(false); }}
                  title="Cancel"
                >
                  <FiX size={14} />
                </button>
              </div>
            ) : (
              <>
                <button
                  className="btn-icon edit"
                  onClick={(e) => { e.stopPropagation(); onEdit(product, e); }}
                  title="Edit Item"
                >
                  <FiEdit size={14} />
                </button>
                <button
                  className="btn-icon delete"
                  onClick={(e) => { e.stopPropagation(); setIsDeleting(true); }}
                  title="Delete Item"
                >
                  <FiTrash2 size={14} />
                </button>
              </>
            )}
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default MenuItem;
