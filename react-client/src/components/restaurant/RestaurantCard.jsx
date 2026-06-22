import React from 'react';
const DEFAULT_RESTAURANT_IMAGE = "/api/uploads/restaurants/default.webp";

const RestaurantCard = React.memo(({ id, name, category, icon, image, distance, description, onClick }) => {
  // Fallback chain: explicit image prop -> default fallback image
  const displayImage = image || DEFAULT_RESTAURANT_IMAGE;

  const handleClick = () => {
    if (onClick && id) {
      onClick(id);
    }
  };

  return (
    <div className="restaurant-card" onClick={handleClick}>
      <div className="restaurant-image-wrapper">
        {displayImage ? (
          <img 
            src={displayImage} 
            alt={name} 
            className="restaurant-image" 
            loading="lazy" 
            decoding="async" 
          />
        ) : (
          <span>{icon}</span>
        )}
        <span className="restaurant-category-badge">{category}</span>
      </div>
      <div className="restaurant-info">
        <h3 className="restaurant-name">{name}</h3>
        {description && <p className="restaurant-description">{description}</p>}

        <div className="restaurant-card-actions">
          {distance !== null && distance !== undefined && (
            <span className="restaurant-card-actions-text">
              📍 {distance.toFixed(1)} km
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

export default RestaurantCard;
