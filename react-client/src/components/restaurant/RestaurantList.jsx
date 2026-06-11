import React from 'react';
import { useNavigate } from 'react-router-dom';
import RestaurantCard from './RestaurantCard';
import './Restaurant.css';

const RestaurantList = ({ restaurants = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="restaurant-grid">
      {restaurants.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id}
          name={restaurant.name}
          category={restaurant.category}
          imageKey={restaurant.imageKey}
          rating={restaurant.rating || "5.0"}
          deliveryTime={restaurant.deliveryTime || "20-30"}
          address={restaurant.address}
          onClick={() => navigate(`/restaurant/${restaurant.id}`)}
        />
      ))}
    </div>
  );
};

export default RestaurantList;
