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
        const userLoc = currentUser?.location || { lat: 32.0853, lng: 34.7818 }; // fallback to default location if missing
        const dist = userLoc && restaurant.location
          ? calculateDistance(userLoc, restaurant.location)
          : null;
        console.log("Restaurant:", restaurant.name, "UserLoc:", userLoc, "RestLoc:", restaurant.location, "Calculated Dist:", dist);
        
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
