import React from 'react';
import imagePizza from '../../images/restaurants/pizza.jpg';
import imageHamburger from '../../images/restaurants/hamburger.jpg';
import imageSushi from '../../images/restaurants/sushi.jpg';
import imageAsian from '../../images/restaurants/wok.jpg';
import imageDessert from '../../images/restaurants/sweet-dreams.jpg';
import imageSalad from '../../images/restaurants/salad.jpg';

const DEFAULT_RESTAURANT_IMAGE = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=60";

const imageMap = {
  burger: imageHamburger,
  pizza: imagePizza,
  sushi: imageSushi,
  asian: imageAsian,
  dessert: imageDessert,
  salad: imageSalad
};

const RestaurantCard = ({ name, category, icon, image, imageKey, rating, deliveryTime, address, onClick }) => {
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
        <p className="restaurant-address">{address}</p>
      </div>
    </div>
  );
};

export default RestaurantCard;
