import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import createStyles from '../styles/HomeScreen.styles';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { categoryService, restaurantService, productService, userService, BASE_URL } from '../services/api';
import { calculateDistance } from '../utils/distance';
import CategoryList from '../components/home/CategoryList';
import RestaurantList from '../components/restaurant/RestaurantList';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import RecommendedProducts from '../components/home/RecommendedProducts';
import ProductDetailModal from '../components/restaurant/ProductDetailModal';

export default function HomeScreen({ navigation }) {
  const { theme, isDark, toggleTheme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const { currentUser } = useAuth();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [restaurants, setRestaurants] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [lastViewed, setLastViewed] = useState(null);
  const [fullUser, setFullUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // States for tapping recommendations
  const [selectedRecProduct, setSelectedRecProduct] = useState(null);
  const [selectedRecRestaurant, setSelectedRecRestaurant] = useState(null);
  const [recModalVisible, setRecModalVisible] = useState(false);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const [catsData, restsData] = await Promise.all([
        categoryService.getAll().catch(() => []),
        restaurantService.getAll().catch(() => [])
      ]);
      setCategories(catsData || []);
      setRestaurants(restsData || []);

      if (currentUser?.id) {
        const user = await userService.getUserById(currentUser.id).catch(() => null);
        setFullUser(user);

        if (user?.lastViewedProduct) {
          try {
            // Load details of the last viewed product
            const viewedProduct = await productService.getByGlobalId(user.lastViewedProduct);
            setLastViewed(viewedProduct);
            
            if (viewedProduct) {
              // Fetch recommendations based on user interaction profile
              const recsData = await productService.getRecommendations(currentUser.id, user.lastViewedProduct).catch(() => []);
              setRecommendations(recsData || []);
            }
          } catch (e) {
            console.error("Failed to load recommendation details:", e);
          }
        } else {
          setLastViewed(null);
          setRecommendations([]);
        }
      } else {
        setFullUser(null);
        setLastViewed(null);
        setRecommendations([]);
      }
    } catch (err) {
      console.error("Failed to load home data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, [currentUser?.id, currentUser?.lastViewedProduct]);

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

    // Filter by category
    const filtered = selectedCategory === 'All'
      ? withDistance
      : withDistance.filter(r => r.category && r.category.toLowerCase() === selectedCategory.toLowerCase());

    return filtered;
  }, [restaurants, selectedCategory, fullUser]);

  const handleRestaurantPress = (restaurant) => {
    navigation.navigate('Restaurant', { restaurant });
  };

  const handleRecProductPress = (product, restaurant) => {
    setSelectedRecProduct(product);
    setSelectedRecRestaurant(restaurant);
    setRecModalVisible(true);
  };

  const renderHeader = () => (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.welcomeText}>
        Welcome, {currentUser?.name || currentUser?.username || 'User'}!
      </Text>

      {currentUser && (
        <RecommendedProducts
          recommendations={recommendations}
          lastViewedProduct={lastViewed}
          onPress={handleRecProductPress}
        />
      )}

      {nearbyRestaurants.length > 0 && (
        <View style={{ marginTop: 24, marginBottom: 20 }}>
          <Text style={styles.sectionTitle}>Nearby Restaurants</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 16 }}>
            {nearbyRestaurants.map((restaurant) => (
              <View key={restaurant.id || restaurant._id} style={{ width: 250, marginRight: 15 }}>
                <RestaurantCard
                  restaurant={restaurant}
                  onPress={handleRestaurantPress}
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

  const renderFooter = () => (
    <View style={styles.footerContainer}>
      <Ionicons name="restaurant" size={32} color={theme.borderDark || theme.border} />
      <Text style={styles.footerTitle}>You've reached the end!</Text>
      <Text style={styles.footerText}> </Text>
      <Text style={styles.footerText}>© 2026 TMT Delivery</Text>
      <Text style={styles.footerText}>Made with ❤️ for Advanced Programming</Text>
      <Text style={[styles.footerText, { marginTop: 8 }]}>Images by Magnific & Unsplash:</Text>
      <View style={{ flexDirection: 'row', marginTop: 2 }}>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.magnific.com/')}>
          <Text style={[styles.footerText, { color: '#00c2e8', textDecorationLine: 'underline' }]}>magnific.com</Text>
        </TouchableOpacity>
        <Text style={styles.footerText}> | </Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://unsplash.com/')}>
          <Text style={[styles.footerText, { color: '#00c2e8', textDecorationLine: 'underline' }]}>unsplash.com</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={require('../../assets/logo.png')} style={styles.logoImage} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 15 }}>
            <Ionicons name={isDark ? 'sunny' : 'moon'} size={24} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            {currentUser?.profilePic || currentUser?.profilePicture ? (
              <Image
                source={{ uri: currentUser.profilePic?.startsWith('http') ? currentUser.profilePic : `${BASE_URL}${currentUser.profilePic || currentUser.profilePicture}` }}
                style={styles.profilePic}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {loading && restaurants.length === 0 ? (
          <ActivityIndicator size="large" color={theme.text} />
        ) : (
          <RestaurantList
            restaurants={displayedRestaurants}
            listHeaderComponent={renderHeader}
            listFooterComponent={renderFooter}
            onRestaurantPress={handleRestaurantPress}
          />
        )}
      </View>

      <ProductDetailModal
        visible={recModalVisible}
        product={selectedRecProduct}
        restaurant={selectedRecRestaurant}
        onClose={() => {
          setRecModalVisible(false);
          setSelectedRecProduct(null);
          setSelectedRecRestaurant(null);
          // Refresh home screen to load any updated recommendations if details triggered a change
          fetchHomeData();
        }}
      />
    </SafeAreaView>
  );
}
