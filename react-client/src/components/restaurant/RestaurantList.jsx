import React from 'react';
import { useNavigate } from 'react-router-dom';
import RestaurantCard from './RestaurantCard';
import mockRestaurants from '../../data/restaurants.json';
import './Restaurant.css';
import imagePizza from '../../images/restaurants/pizza.jpg';
import imageHamburger from '../../images/restaurants/hamburger.jpg';
import imageSushi from '../../images/restaurants/sushi.jpg';
import imageAsian from '../../images/restaurants/wok.jpg';
import imageDessert from '../../images/restaurants/sweet-dreams.jpg';
import imageSalad from '../../images/restaurants/salad.jpg';

const RestaurantList = ({ restaurants = [] }) => {
  const navigate = useNavigate();
  const imageMap = {
    burger: imageHamburger,
    pizza: imagePizza,
    sushi: imageSushi,
    asian: imageAsian,
    dessert: imageDessert,
    salad: imageSalad
  };

  return (
    <div className="restaurant-list">
      {restaurants.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id}
          id={restaurant.id}
          name={restaurant.name}
          category={restaurant.category}
          // Fallback to burger image if no matching imageKey is found or provided
          image={imageMap[restaurant.imageKey] || imageMap.burger}
          rating={restaurant.rating || "5.0"}
          deliveryTime={restaurant.deliveryTime || "20-30"}
          address={restaurant.address}
          onClick={() => navigate('/restaurant/' + restaurant.id)}
        />
      ))}
    </div>
  );
};

export default RestaurantList;
