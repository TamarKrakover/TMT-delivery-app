import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, ActivityIndicator, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { productService, restaurantService, BASE_URL } from '../services/api';
import ProductDetailModal from '../components/restaurant/ProductDetailModal';
import createStyles from '../styles/RestaurantScreen.styles';

const DEFAULT_RESTAURANT_IMAGE = "/api/uploads/restaurants/default.webp";
const DEFAULT_PRODUCT_IMAGE = "/api/uploads/products/default.webp";

export default function RestaurantScreen({ route, navigation }) {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const { restaurant: initialRestaurant, restaurantId } = route.params || {};

  const [restaurant, setRestaurant] = useState(initialRestaurant || null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Selected product detail modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const targetId = restaurantId || initialRestaurant?.id || initialRestaurant?._id;
        
        if (!targetId) {
          setError('Invalid restaurant parameter.');
          setLoading(false);
          return;
        }

        // Fetch restaurant if details are not fully passed
        let restData = restaurant;
        if (!restData) {
          restData = await restaurantService.getById(targetId);
          setRestaurant(restData);
        }

        // Fetch products
        const productsData = await productService.getByRestaurantId(targetId);
        setProducts(productsData || []);
      } catch (err) {
        console.error("Failed to load restaurant menu:", err);
        setError("Could not load menu. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [restaurantId, initialRestaurant]);

  const handleProductPress = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const renderHeader = () => {
    if (!restaurant) return null;

    const displayImage = restaurant.image || DEFAULT_RESTAURANT_IMAGE;
    const imageUrl = displayImage.startsWith('http') ? displayImage : `${BASE_URL}${displayImage}`;

    return (
      <View>
        <ImageBackground source={{ uri: imageUrl }} style={styles.heroImage}>
          <SafeAreaView style={styles.heroOverlay} edges={['top']}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
          </SafeAreaView>
        </ImageBackground>

        <View style={styles.detailsCard}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          {restaurant.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{restaurant.category}</Text>
            </View>
          )}
          <Text style={styles.restaurantDesc}>
            {restaurant.description || 'No description available for this restaurant.'}
          </Text>
        </View>

        <Text style={styles.menuTitle}>Menu Items</Text>
      </View>
    );
  };

  const renderProductItem = ({ item }) => {
    const displayImage = item.image || DEFAULT_PRODUCT_IMAGE;
    const imageUrl = displayImage.startsWith('http') ? displayImage : `${BASE_URL}${displayImage}`;

    return (
      <TouchableOpacity 
        style={styles.productCard} 
        activeOpacity={0.8}
        onPress={() => handleProductPress(item)}
      >
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>₪{parseFloat(item.price).toFixed(2)}</Text>
          {item.description ? (
            <Text style={styles.productDesc} numberOfLines={2}>
              {item.description}
            </Text>
          ) : null}
        </View>
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.productImage}
          defaultSource={require('../../assets/icon.png')}
        />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.text} />
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading menu details...</Text>
      </SafeAreaView>
    );
  }

  if (error || !restaurant) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color={theme.textSecondary} />
        <Text style={styles.errorText}>{error || 'Restaurant not found.'}</Text>
        <TouchableOpacity style={styles.errorBackButton} onPress={() => navigation.goBack()}>
          <Text style={styles.errorBackButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id || item._id}
        renderItem={renderProductItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyMenuContainer}>
            <Ionicons name="fast-food-outline" size={48} color={theme.textSecondary} />
            <Text style={styles.emptyMenuText}>No menu items found for this restaurant.</Text>
          </View>
        )}
      />

      <ProductDetailModal
        visible={modalVisible}
        product={selectedProduct}
        restaurant={restaurant}
        onClose={() => {
          setModalVisible(false);
          setSelectedProduct(null);
        }}
      />
    </View>
  );
}
