import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/HomeScreen.styles';
import { Ionicons } from '@expo/vector-icons';
import { categoryService, restaurantService, getLastViewedProduct, userService } from '../services/api';
import { calculateDistance } from '../utils/distance';
import CategoryList from '../components/home/CategoryList';
import RestaurantList from '../components/restaurant/RestaurantList';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import RecommendedProducts from '../components/home/RecommendedProducts';

export default function HomeScreen({ navigation, userSession }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [restaurants, setRestaurants] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [lastViewed, setLastViewed] = useState(null);
  const [fullUser, setFullUser] = useState(null);
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

        if (userSession?.id) {
          const user = await userService.getUserById(userSession.id).catch(() => null);
          setFullUser(user);

          let viewedProduct = await getLastViewedProduct(userSession.id);


          if (viewedProduct) {
            setLastViewed(viewedProduct);
            const recsData = await restaurantService.getRecommendations(viewedProduct.id || viewedProduct._id).catch(() => []);
            setRecommendations(recsData || []);
          }
        }
      } catch (err) {
        console.error("Failed to load home data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userSession?.id]);

  const nearbyRestaurants = React.useMemo(() => {
    if (!restaurants || !fullUser?.location) return [];
    
    return restaurants.map(r => {
      const dist = r.location ? calculateDistance(fullUser.location, r.location) : null;
      return { ...r, distance: dist };
    })
    .filter(r => r.distance !== null && r.distance <= 5)
    .sort((a, b) => a.distance - b.distance);
  }, [restaurants, fullUser]);

  const displayedRestaurants = React.useMemo(() => {
    if (!restaurants) return [];
    
    // Base mapping to attach distance
    const withDistance = restaurants.map(r => {
      const dist = (fullUser?.location && r.location) ? calculateDistance(fullUser.location, r.location) : null;
      return { ...r, distance: dist };
    });

    // Default: Filter by category (no distance sort)
    const filtered = selectedCategory === 'All' 
      ? withDistance 
      : withDistance.filter(r => r.category && r.category.toLowerCase() === selectedCategory.toLowerCase());
      
    return filtered;
  }, [restaurants, selectedCategory, fullUser]);

  const renderHeader = () => (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.welcomeText}>Welcome, {userSession?.name || userSession?.username || 'User'}!</Text>
      
      {recommendations.length > 0 && (
        <RecommendedProducts 
          recommendations={recommendations} 
          lastViewedProduct={lastViewed}
        />
      )}

      {nearbyRestaurants.length > 0 && (
        <View style={{ marginTop: 24, marginBottom: 20 }}>
          <Text style={styles.sectionTitle}>Nearby Restaurants</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {nearbyRestaurants.map((restaurant) => (
              <View key={restaurant.id || restaurant._id} style={{ width: 250, marginRight: 15 }}>
                <RestaurantCard 
                  restaurant={restaurant} 
                  onPress={(r) => console.log('Pressed', r.name)} 
                />
              </View>
            ))}
          </ScrollView>
        </View>
      )}

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
