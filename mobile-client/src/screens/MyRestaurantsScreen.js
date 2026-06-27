import React, { useState, useEffect } from 'react';
import MyRestaurantsScreenView from '../styles/MyRestaurantsScreen.styles';
import { useAuth } from '../contexts/AuthContext';
import { restaurantService } from '../services/api';

export default function MyRestaurantsScreen({ navigation }) {
  const { currentUser } = useAuth();
  
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal open/close state
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchMyRestaurants();
  }, [currentUser]);

  const fetchMyRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);
      const allRestaurants = await restaurantService.getAll();
      
      if (allRestaurants && currentUser) {
        const myRests = allRestaurants.filter(r => r.creatorId === currentUser.id);
        setRestaurants(myRests);
      }
    } catch (err) {
      console.log("Failed to fetch my restaurants:", err.message);
      setError("Failed to load your restaurants. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantPress = (restaurant) => {
    navigation.navigate('Restaurant', { restaurantId: restaurant.id || restaurant._id });
  };

  return (
    <MyRestaurantsScreenView 
      navigation={navigation}
      loading={loading}
      error={error}
      restaurants={restaurants}
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      fetchMyRestaurants={fetchMyRestaurants}
      handleRestaurantPress={handleRestaurantPress}
    />
  );
}
