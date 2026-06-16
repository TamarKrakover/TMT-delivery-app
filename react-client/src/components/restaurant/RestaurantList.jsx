import React from 'react';
import { useNavigate } from 'react-router-dom';
import RestaurantCard from './RestaurantCard';
import './Restaurant.css';

const RestaurantList = ({ restaurants = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="restaurant-grid">
      {restaurants.map((restaurant) => {
        const dist = restaurant.distance !== undefined ? restaurant.distance : null;
        
        return (
          <RestaurantCard
            key={restaurant.id}
            id={restaurant.id}
            name={restaurant.name}
            category={restaurant.category}
            image={restaurant.image}
            description={restaurant.description}
            distance={dist}
            onClick={() => navigate(`/restaurant/${restaurant.id}`)}
          />
        );
      })}
    </div>
  );
};

export default RestaurantList;
