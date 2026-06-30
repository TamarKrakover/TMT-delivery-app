import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Modal, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../theme/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { BASE_URL, productService, uploadService } from '../../services/api';
import { createStyles } from '../../styles/ProductDetailModal.styles';
import * as ImagePicker from 'expo-image-picker';

const DEFAULT_PRODUCT_IMAGE = "/api/uploads/products/default.webp";

export default function ProductDetailModal({ visible, product, restaurant, onClose, onProductUpdated }) {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  const { addToCart } = useCart();
  const { currentUser, updateLastViewedProduct } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (visible && product && restaurant && currentUser) {
      const restId = restaurant.id || restaurant._id;
      const prodId = product.id || product._id;
      
      // Trigger backend log view (which saves interaction to C++ TCP recommendation server)
      productService.getById(restId, prodId).catch((err) => {
        console.log('Failed to log product view on backend:', err.message);
      });

      updateLastViewedProduct(product).catch((err) => {
        console.log('Failed to log last viewed product locally:', err.message);
      });
    }
  }, [visible, product, restaurant, currentUser]);

  useEffect(() => {
    if (!visible) {
      setIsEditing(false);
      setError(null);
    } else if (product) {
      setName(product.name || '');
      setPrice(product.price ? String(product.price) : '');
      setDescription(product.description || '');
      setImage(product.image || '');
    }
  }, [visible, product]);

  const pickImage = async (useCamera = false) => {
    try {
      let result;
      if (useCamera) {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
          Alert.alert('Permission needed', 'You need to grant camera permissions to take a picture.');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      } else {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
          Alert.alert('Permission needed', 'You need to grant gallery permissions to select a picture.');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
        setError(null);
      }
    } catch (err) {
      console.error('Error picking image:', err);
      setError('Failed to select image.');
    }
  };

  if (!product) return null;

  const isCreator = currentUser && (restaurant?.creatorId === currentUser.id || currentUser.isAdmin);
  const displayImage = product.image || DEFAULT_PRODUCT_IMAGE;
  const imageUrl = displayImage.startsWith('http') ? displayImage : `${BASE_URL}${displayImage}`;

  const previewUri = image
    ? (image.startsWith('http') || image.startsWith('file://') || image.startsWith('content://') 
      ? image 
      : `${BASE_URL}${image}`)
    : null;

  const handleAddToOrder = async () => {
    await addToCart(product, restaurant);
    onClose();
  };

  const handleSaveProduct = async () => {
    if (!name.trim()) {
      setError('Product name is required.');
      return;
    }
    if (!price.trim() || isNaN(parseFloat(price))) {
      setError('Product price must be a valid number.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      let finalImageUrl = image && image.trim() !== '' ? image.trim() : (product.image || '');
      if (image && !image.startsWith('/api/') && !image.startsWith('http://') && !image.startsWith('https://')) {
        const uploadResponse = await uploadService.uploadImage(image);
        if (uploadResponse && uploadResponse.url) {
          finalImageUrl = uploadResponse.url;
        }
      }

      const payload = {
        name: name.trim(),
        price: parseFloat(price),
        description: description.trim(),
        image: finalImageUrl || undefined
      };

      const restId = restaurant.id || restaurant._id;
      const prodId = product.id || product._id;

      await productService.update(restId, prodId, payload);
      
      if (onProductUpdated) {
        await onProductUpdated();
      }

      setIsEditing(false);
      onClose();
    } catch (err) {
      console.log("Failed to update product:", err.message);
      setError(err.message || 'Failed to update product. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = () => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              setSubmitting(true);
              const restId = restaurant.id || restaurant._id;
              const prodId = product.id || product._id;
              await productService.delete(restId, prodId);
              
              if (onProductUpdated) {
                await onProductUpdated();
              }
              onClose();
            } catch (err) {
              console.log("Failed to delete product:", err.message);
              Alert.alert("Error", err.message || "Failed to delete product.");
            } finally {
              setSubmitting(false);
            }
          }
        }
      ]
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={theme.text} />
          </TouchableOpacity>

          {isCreator && !isEditing && (
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={() => setIsEditing(true)}
            >
              <Ionicons name="create-outline" size={24} color={theme.text} />
            </TouchableOpacity>
          )}

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {isEditing ? (
              <View style={styles.infoContainer}>
                <Text style={styles.editModalTitle}>Edit Product Details</Text>
                {error && <Text style={styles.errorText}>{error}</Text>}
                
                <Text style={styles.inputLabel}>Product Name *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter product name"
                  placeholderTextColor={theme.textSecondary}
                  value={name}
                  onChangeText={setName}
                />

                <Text style={styles.inputLabel}>Price * (₪)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. 35.5"
                  placeholderTextColor={theme.textSecondary}
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                />

                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={styles.textInputArea}
                  placeholder="Enter product description"
                  placeholderTextColor={theme.textSecondary}
                  value={description}
                  onChangeText={setDescription}
                  multiline={true}
                  numberOfLines={3}
                />

                <View style={styles.imagePickerContainer}>
                  <Text style={styles.inputLabel}>Product Image (Optional)</Text>
                  
                  <View style={styles.imagePreviewArea}>
                    {previewUri ? (
                      <Image source={{ uri: previewUri }} style={styles.imagePreview} resizeMode="cover" />
                    ) : (
                      <>
                        <Ionicons name="image-outline" size={48} color={theme.textSecondary} />
                        <Text style={styles.placeholderText}>No image selected</Text>
                      </>
                    )}
                  </View>

                  <View style={styles.imageActionButtons}>
                    <TouchableOpacity 
                      style={styles.imageBtn} 
                      onPress={() => pickImage(false)}
                      disabled={submitting}
                    >
                      <Ionicons name="images-outline" size={20} color={theme.text} />
                      <Text style={styles.imageBtnText}>Gallery</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.imageBtn} 
                      onPress={() => pickImage(true)}
                      disabled={submitting}
                    >
                      <Ionicons name="camera-outline" size={20} color={theme.text} />
                      <Text style={styles.imageBtnText}>Camera</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={handleDeleteProduct}
                  disabled={submitting}
                >
                  <Text style={styles.deleteButtonText}>Delete Product</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {product.image ? (
                  <Image source={{ uri: imageUrl }} style={styles.productImage} />
                ) : (
                  <View style={styles.noImageContainer}>
                    <Ionicons name="fast-food-outline" size={60} color={theme.textSecondary} />
                    <Text style={styles.noImageText}>No image available</Text>
                  </View>
                )}

                <View style={styles.infoContainer}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productPrice}>₪{parseFloat(product.price).toFixed(2)}</Text>
                  
                  <View style={styles.divider} />
                  
                  <Text style={styles.sectionTitle}>Description</Text>
                  <Text style={styles.productDescription}>
                    {product.description || 'No description available for this item.'}
                  </Text>
                </View>
              </>
            )}
          </ScrollView>

          {isEditing ? (
            <View style={styles.footerCreator}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setIsEditing(false)}
                disabled={submitting}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton} 
                onPress={handleSaveProduct}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.saveButtonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.footerUser}>
              <TouchableOpacity style={styles.addButton} onPress={handleAddToOrder}>
                <Ionicons name="cart" size={20} color="#ffffff" style={styles.cartIcon} />
                <Text style={styles.addButtonText}>Add to Order</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

