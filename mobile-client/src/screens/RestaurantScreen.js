import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, ActivityIndicator, ImageBackground, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { productService, restaurantService, BASE_URL } from '../services/api';
import { COLORS, SIZES, FONTS } from '../theme/theme';
import ProductDetailModal from '../components/restaurant/ProductDetailModal';
import EditRestaurantModal from '../components/restaurant/EditRestaurantModal';
import AddProductModal from '../components/restaurant/AddProductModal';
import CustomAlertModal from '../components/CustomAlertModal';
import { createStyles } from '../styles/RestaurantScreen.styles';

const DEFAULT_RESTAURANT_IMAGE = "/api/uploads/restaurants/default.webp";
const DEFAULT_PRODUCT_IMAGE = "/api/uploads/products/default.webp";

export default function RestaurantScreen({ route, navigation }) {
  const { currentUser } = useAuth();
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

  // Edit Restaurant modal state
  const [editModalVisible, setEditModalVisible] = useState(false);
  // 'hidden' | 'confirm' | 'success'
  const [deleteModalState, setDeleteModalState] = useState('hidden');

  // Add Product modal state
  const [addProductModalVisible, setAddProductModalVisible] = useState(false);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const targetId = restaurantId || initialRestaurant?.id || initialRestaurant?._id;
      
      if (!targetId) {
        setError('Invalid restaurant parameter.');
        setLoading(false);
        return;
      }

      // Always fetch freshest details from the backend
      const restData = await restaurantService.getById(targetId);
      setRestaurant(restData);

      // Fetch products
      const productsData = await productService.getByRestaurantId(targetId);
      setProducts(productsData || []);
    } catch (err) {
      console.log("Failed to load restaurant menu:", err.message);
      setError("Could not load menu. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [restaurantId, initialRestaurant]);

  const handleProductPress = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const handleRestaurantUpdated = (updatedPayload) => {
    setRestaurant(prev => ({
      ...prev,
      ...updatedPayload
    }));
  };

  const handleRestaurantDeleted = () => {
    setDeleteModalState('confirm');
  };

  const confirmDeleteRestaurant = async () => {
    try {
      const targetId = restaurant.id || restaurant._id;
      await restaurantService.delete(targetId);
      setDeleteModalState('success');
    } catch (err) {
      console.log("Failed to delete restaurant:", err.message);
      setDeleteModalState('hidden');
      setTimeout(() => {
        Alert.alert("Error", err.message || "Failed to delete restaurant.");
      }, 500);
    }
  };

  const handleSuccessClose = () => {
    setDeleteModalState('hidden');
    navigation.goBack();
  };

  const handleProductsRefresh = async () => {
    const targetId = restaurant.id || restaurant._id;
    const productsData = await productService.getByRestaurantId(targetId);
    setProducts(productsData || []);
  };

  const isCreator = currentUser && (restaurant && (restaurant.creatorId === currentUser.id || currentUser.isAdmin));

  const renderHeader = () => {
    if (!restaurant) return null;
    const displayImage = restaurant.image || DEFAULT_RESTAURANT_IMAGE;
    const imageUrl = displayImage.startsWith('http') ? displayImage : `${BASE_URL}${displayImage}`;

    return (
      <View>
        <ImageBackground source={{ uri: imageUrl }} style={styles.heroImage}>
          <SafeAreaView style={[styles.heroOverlay, styles.heroOverlayCreator]} edges={['top']}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            
            {isCreator && (
              <View style={styles.rightActions}>
                <TouchableOpacity 
                  style={[styles.backButton, { marginRight: SIZES.xs, backgroundColor: 'rgba(255, 59, 48, 0.7)' }]} 
                  onPress={handleRestaurantDeleted}
                >
                  <Ionicons name="trash-outline" size={24} color="#ffffff" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.backButton} 
                  onPress={() => setEditModalVisible(true)}
                >
                  <Ionicons name="create-outline" size={24} color="#ffffff" />
                </TouchableOpacity>
              </View>
            )}
          </SafeAreaView>
        </ImageBackground>

        <View style={styles.detailsCard}>
          <View style={styles.detailsHeaderRow}>
            <Text style={styles.restaurantNameCreator}>{restaurant.name}</Text>
            {isCreator && (
              <TouchableOpacity 
                style={styles.addProductButton}
                onPress={() => setAddProductModalVisible(true)}
              >
                <Ionicons name="add" size={16} color={COLORS.primary} style={{ marginRight: 4 }} />
                <Text style={styles.addProductButtonText}>Add Product</Text>
              </TouchableOpacity>
            )}
          </View>
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
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
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
        onProductUpdated={handleProductsRefresh}
      />

      <EditRestaurantModal
        visible={editModalVisible}
        restaurant={restaurant}
        onClose={() => setEditModalVisible(false)}
        onRestaurantUpdated={handleRestaurantUpdated}
      />

      <AddProductModal
        visible={addProductModalVisible}
        restaurant={restaurant}
        onClose={() => setAddProductModalVisible(false)}
        onProductAdded={handleProductsRefresh}
      />

      <CustomAlertModal
        visible={deleteModalState !== 'hidden'}
        title={deleteModalState === 'success' ? "Success" : "Delete Restaurant"}
        message={deleteModalState === 'success' 
          ? "Restaurant deleted successfully." 
          : "Are you sure you want to delete this restaurant? This action cannot be undone."
        }
        onClose={deleteModalState === 'success' ? handleSuccessClose : () => setDeleteModalState('hidden')}
        buttons={deleteModalState === 'success' ? [
          { text: "OK", style: "primary", onPress: handleSuccessClose }
        ] : [
          { text: "Cancel", style: "secondary" },
          { text: "Delete", style: "danger", onPress: confirmDeleteRestaurant }
        ]}
      />
    </SafeAreaView>
  );
}

