import React from 'react';
import { FiClock, FiShoppingBag } from '../../components/common/Icons';
import './OrderCard.css';

const OrderCard = ({ order, restaurant, restaurantProducts = [] }) => {
  const date = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const itemCount = order.productIds ? order.productIds.length : 0;
  const restaurantName = restaurant ? restaurant.name : 'Unknown Restaurant';

  // Group products by ID to count quantities
  const groupedProducts = order.productIds?.reduce((acc, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {});

  // Map to human-readable item names using the fetched products
  const itemNames = groupedProducts 
    ? Object.entries(groupedProducts).map(([id, count]) => {
        const product = restaurantProducts.find(p => p.id === id);
        const name = product ? product.name : 'Unknown Item';
        return `${count}x ${name}`;
      })
    : [];

  return (
    <div className="order-card">
      <div className="order-card-header">
        <div>
          <h3 className="order-restaurant-name">{restaurantName}</h3>
          <span className="order-date"><FiClock size={14} /> {date}</span>
        </div>
        <span className={`order-status ${order.status?.toLowerCase()}`}>
          {order.status || 'Pending'}
        </span>
      </div>

      <div className="order-items-list">
        <div className="order-item-row">
          <span className="order-item-name">
            <FiShoppingBag size={16} /> 
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
        </div>
        {itemNames.length > 0 && (
          <div className="order-card-items-details">
            {itemNames.map((item, idx) => (
              <span key={idx}>• {item}</span>
            ))}
          </div>
        )}
      </div>

      <div className="order-card-footer">
        <span className="order-total-label">Total Amount</span>
        <span className="order-total-price">
          ${(order.totalPrice || 0).toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default OrderCard;
