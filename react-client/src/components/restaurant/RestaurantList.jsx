import React from 'react';
import { useNavigate } from 'react-router-dom';
import RestaurantCard from './RestaurantCard';
import { useAuth } from '../../contexts/AuthContext';
import { calculateDistance } from '../../utils/distance';
import './Restaurant.css';

const RestaurantList = ({ restaurants = [] }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();


  return (
    <div className="restaurant-grid">
      {restaurants.map((restaurant) => {
        const dist = currentUser?.location && restaurant.location
          ? calculateDistance(currentUser.location, restaurant.location)
          : null;
        
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
