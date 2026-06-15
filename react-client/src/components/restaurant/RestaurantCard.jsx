import React from 'react';
const DEFAULT_RESTAURANT_IMAGE = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=60";

const imageMap = {
  burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
  pizza: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",
  sushi: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=80",
  asian: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80",
  dessert: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&auto=format&fit=crop&q=80",
  salad: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80"
};

const RestaurantCard = ({ name, category, icon, image, imageKey, rating, deliveryTime, address, distance, onClick }) => {
  // Fallback chain: explicit image prop -> mapped imageKey -> default fallback image
  const displayImage = image || (imageKey && imageMap[imageKey.toLowerCase()]) || DEFAULT_RESTAURANT_IMAGE;


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
        <div className="restaurant-meta">
          <span className="restaurant-rating">⭐ {rating}</span>
          <span>•</span>
          <span>{deliveryTime} mins</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p className="restaurant-address">{address}</p>
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
