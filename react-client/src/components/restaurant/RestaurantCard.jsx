import React from 'react';

const RestaurantCard = ({ name, category, icon, image, rating, deliveryTime, address }) => {
  return (
    <div className="restaurant-card">
      <div className="restaurant-image-wrapper">
        {image ? (
          <img src={image} alt={name} className="restaurant-image" />
        ) : (
          <span>{icon}</span>
        )}
        <span className="restaurant-category-badge">{category}</span>
      </div>
      <div className="restaurant-info">
        <h3 className="restaurant-name">{name}</h3>
        <div className="restaurant-meta">
          <span className="restaurant-rating">⭐ {rating}</span>
          <span>•</span>
          <span>{deliveryTime} mins</span>
        </div>
        <p className="restaurant-address">{address}</p>
      </div>
    </div>
  );
};

export default RestaurantCard;
