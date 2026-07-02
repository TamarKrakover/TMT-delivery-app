import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { restaurantService } from '../services/api';
import RestaurantList from '../components/restaurant/RestaurantList';
import AddRestaurantModal from '../components/restaurant/AddRestaurantModal';
import { createStyles } from '../styles/MyRestaurantsScreen.styles';

export default function MyRestaurantsScreen({ navigation }) {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal open/close state
  const [modalVisible, setModalVisible] = useState(false);

  const fetchMyRestaurants = useCallback(async () => {
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
  }, [currentUser]);

  useFocusEffect(
    useCallback(() => {
      fetchMyRestaurants();
    }, [fetchMyRestaurants])
  );

  const handleRestaurantPress = (restaurant) => {
    navigation.navigate('Restaurant', { restaurantId: restaurant.id || restaurant._id });
  };

  const renderHeader = () => (
    <View style={styles.headerRow}>
      <View style={styles.headerLeftRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Restaurants</Text>
      </View>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButtonPadding}>
        <Ionicons name="add" size={28} color={theme.text} />
      </TouchableOpacity>
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
            <TouchableOpacity 
              style={styles.emptyActionButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.emptyActionButtonText}>Add Your First Restaurant</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <RestaurantList 
            restaurants={restaurants}
            onRestaurantPress={handleRestaurantPress}
          />
        )}
      </View>

      <AddRestaurantModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onRestaurantAdded={fetchMyRestaurants}
      />
    </SafeAreaView>
  );
}

