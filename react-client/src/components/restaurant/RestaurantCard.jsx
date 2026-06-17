import React from 'react';
const DEFAULT_RESTAURANT_IMAGE = "/api/uploads/restaurants/default.webp";

const RestaurantCard = ({ name, category, icon, image, distance, description, onClick }) => {
  // Fallback chain: explicit image prop -> default fallback image
  const displayImage = image || DEFAULT_RESTAURANT_IMAGE;


  return (
    <div className="restaurant-card" onClick={onClick}>
      <div className="restaurant-image-wrapper">
        {displayImage ? (
          <img src={displayImage} alt={name} className="restaurant-image" />
        ) : (
          <span>{icon}</span>
        )}
        <span className="restaurant-category-badge">{category}</span>
      </div>
      <div className="restaurant-info">
        <h3 className="restaurant-name">{name}</h3>
        {description && <p className="restaurant-description">{description}</p>}

        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          {distance !== null && distance !== undefined && (
            <span style={{ fontSize: '0.85em', color: 'var(--primary)', fontWeight: 'bold' }}>
              📍 {distance.toFixed(1)} km
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
