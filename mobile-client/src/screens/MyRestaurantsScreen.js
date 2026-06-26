import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import createStyles from '../styles/MyRestaurantsScreen.styles';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { restaurantService } from '../services/api';
import RestaurantList from '../components/restaurant/RestaurantList';

export default function MyRestaurantsScreen({ navigation }) {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  const { currentUser } = useAuth();
  
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyRestaurants();
  }, [currentUser]);

  const fetchMyRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch all restaurants
      const allRestaurants = await restaurantService.getAll();
      
      // Filter by current user
      if (allRestaurants && currentUser) {
        const myRests = allRestaurants.filter(r => r.creatorId === currentUser.id);
        setRestaurants(myRests);
      }
    } catch (err) {
      console.error("Failed to fetch my restaurants:", err);
      setError("Failed to load your restaurants. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantPress = (restaurant) => {
    // Navigate to the regular RestaurantScreen for now
    navigation.navigate('Restaurant', { restaurantId: restaurant.id || restaurant._id });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={theme.text} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>My Restaurants</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {renderHeader()}
      
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.text} />
          </View>
        ) : error ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="alert-circle-outline" size={48} color={theme.textSecondary} />
            <Text style={styles.emptyText}>{error}</Text>
          </View>
        ) : restaurants.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="restaurant-outline" size={60} color={theme.textSecondary} />
            <Text style={styles.emptyTitle}>No Restaurants Yet</Text>
            <Text style={styles.emptyText}>
              You haven't added any restaurants yet.
            </Text>
          </View>
        ) : (
          <RestaurantList 
            restaurants={restaurants}
            onRestaurantPress={handleRestaurantPress}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
