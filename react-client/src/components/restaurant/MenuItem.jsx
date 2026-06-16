import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import { useCart } from '../../contexts/CartContext';

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=60";

const imageMap = {
  burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
  pizza: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",
  sushi: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=80",
  asian: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80",
  dessert: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&auto=format&fit=crop&q=80",
  salad: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80",
  general: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=60"
};

const MenuItem = ({ product, restaurant, canModify, onClick, onEdit, onDelete }) => {
  const { addToCart } = useCart();
  const [isDeleting, setIsDeleting] = useState(false);

  const categoryImage = restaurant?.imageKey ? imageMap[restaurant.imageKey.toLowerCase()] : null;
  const displayImage = product.image || categoryImage || DEFAULT_IMAGE;

  return (
    <div className="menu-item-card" onClick={() => !isDeleting && onClick(product)}>
      <div style={{ width: '130px', height: '100%', minHeight: '130px', flexShrink: 0, backgroundImage: `url(${displayImage})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '8px' }}></div>
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
