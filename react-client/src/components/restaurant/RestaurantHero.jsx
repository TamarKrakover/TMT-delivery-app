import React from 'react';
import { FiStar, FiClock, FiMapPin } from 'react-icons/fi';

const RestaurantHero = ({ restaurant, bgImage }) => {
  if (!restaurant) return null;

  return (
    <section className="restaurant-hero" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="restaurant-hero-overlay"></div>
      <div className="restaurant-hero-content">
        <span className="restaurant-meta-badge">{restaurant.category}</span>
        <h1 className="restaurant-hero-title">{restaurant.name}</h1>
        <p className="restaurant-hero-desc">{restaurant.description || 'No description available.'}</p>

        <div className="restaurant-hero-meta">
          <span className="restaurant-meta-item">
            <FiStar style={{ color: '#fbbf24' }} /> {restaurant.rating || '5.0'}
          </span>
          <span className="restaurant-meta-item">
            <FiClock /> {restaurant.deliveryTime || '20-30'} mins
          </span>
        </div>
      </div>
    </section>
  );
};

export default RestaurantHero;
