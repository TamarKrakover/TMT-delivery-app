import React from 'react';
import RestaurantCard from './RestaurantCard';
import mockRestaurants from '../../data/restaurants.json';
import './Restaurant.css';
import imagePizza from '../../images/restaurants/pizza.jpg';
import imageHamburger from '../../images/restaurants/hamburger.jpg';
import imageSushi from '../../images/restaurants/sushi.jpg';
import imageAsian from '../../images/restaurants/wok.jpg';
import imageDessert from '../../images/restaurants/sweet-dreams.jpg';
import imageSalad from '../../images/restaurants/salad.jpg';

const RestaurantList = () => {
  const imageMap = {
    burger: imageHamburger,
    pizza: imagePizza,
    sushi: imageSushi,
    asian: imageAsian,
    dessert: imageDessert,
    salad: imageSalad
  };

  return (
    <div className="restaurant-grid">
      {mockRestaurants.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id}
          name={restaurant.name}
          category={restaurant.category}
          image={imageMap[restaurant.imageKey]}
          rating={restaurant.rating}
          deliveryTime={restaurant.deliveryTime}
          address={restaurant.address}
        />
      ))}
    </div>
  );
};

export default RestaurantList;
