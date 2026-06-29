import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import RestaurantScreenView from '../styles/RestaurantScreen.styles';
import { useAuth } from '../contexts/AuthContext';
import { productService, restaurantService } from '../services/api';

export default function RestaurantScreen({ route, navigation }) {
  const { currentUser } = useAuth();
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

  return (
    <RestaurantScreenView
      navigation={navigation}
      loading={loading}
      error={error}
      restaurant={restaurant}
      products={products}
      currentUser={currentUser}
      selectedProduct={selectedProduct}
      setSelectedProduct={setSelectedProduct}
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      editModalVisible={editModalVisible}
      setEditModalVisible={setEditModalVisible}
      deleteModalState={deleteModalState}
      setDeleteModalState={setDeleteModalState}
      addProductModalVisible={addProductModalVisible}
      setAddProductModalVisible={setAddProductModalVisible}
      handleProductsRefresh={handleProductsRefresh}
      handleRestaurantUpdated={handleRestaurantUpdated}
      handleRestaurantDeleted={handleRestaurantDeleted}
      confirmDeleteRestaurant={confirmDeleteRestaurant}
      handleSuccessClose={handleSuccessClose}
      handleProductPress={handleProductPress}
    />
  );
}
