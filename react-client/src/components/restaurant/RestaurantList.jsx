import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import RestaurantCard from './RestaurantCard';
import { useAuth } from '../../contexts/AuthContext';
import { calculateDistance } from '../../utils/distance';
import ScrollableRow from '../common/ScrollableRow';
import './Restaurant.css';

const RestaurantList = React.memo(({ restaurants = [] }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleCardClick = useCallback((id) => {
    navigate(`/restaurant/${id}`);
  }, [navigate]);

  return (
    <ScrollableRow className="restaurant-grid-wrapper">
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
            distance={dist}
            description={restaurant.description}
            onClick={handleCardClick}
          />
        );
      })}
      </div>
    </ScrollableRow>
  );
});

export default RestaurantList;
