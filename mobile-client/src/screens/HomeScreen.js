import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/HomeScreen.styles';
import { Ionicons } from '@expo/vector-icons';
import { categoryService, restaurantService } from '../services/api';
import CategoryList from '../components/home/CategoryList';
import RestaurantList from '../components/restaurant/RestaurantList';

export default function HomeScreen({ navigation, userSession }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catsData, restsData] = await Promise.all([
          categoryService.getAll().catch(() => []),
          restaurantService.getAll().catch(() => [])
        ]);
        setCategories(catsData || []);
        setRestaurants(restsData || []);
      } catch (err) {
        console.error("Failed to load home data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const displayedRestaurants = React.useMemo(() => {
    if (!restaurants) return [];
    if (selectedCategory === 'All') return restaurants;
    return restaurants.filter(
      r => r.category && r.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [restaurants, selectedCategory]);

  const renderHeader = () => (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.welcomeText}>Welcome, {userSession?.name || 'User'}!</Text>
      
      <CategoryList 
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <Text style={styles.subtitle}>Selected Category: {selectedCategory}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={require('../../assets/logo.png')} style={styles.logoImage} />
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          {userSession?.profilePicture ? (
            <Image 
              source={{ uri: userSession.profilePicture }} 
              style={styles.profilePic} 
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {userSession?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <RestaurantList 
          restaurants={displayedRestaurants}
          listHeaderComponent={renderHeader}
          onRestaurantPress={(restaurant) => {
            // We will navigate to Restaurant detail screen later
            console.log('Pressed', restaurant.name);
          }}
        />
      </View>
    </SafeAreaView>
  );
}
