import React from 'react';
import { FiClock, FiShoppingBag } from 'react-icons/fi';
import './OrderCard.css';

const OrderCard = ({ order, restaurant }) => {
  const date = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const itemCount = order.productIds ? order.productIds.length : 0;
  const restaurantName = restaurant ? restaurant.name : 'Unknown Restaurant';

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
