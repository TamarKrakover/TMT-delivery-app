import React, { useState, useEffect } from 'react';
import ProductDetailModalView from '../../styles/ProductDetailModal.styles';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { BASE_URL, productService } from '../../services/api';
import { Alert } from 'react-native';
import CustomAlertModal from '../CustomAlertModal';

const DEFAULT_PRODUCT_IMAGE = "/api/uploads/products/default.webp";

export default function ProductDetailModal({ visible, product, restaurant, onClose, onProductUpdated }) {
  const { addToCart } = useCart();
  const { currentUser, updateLastViewedProduct } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showAuthAlert, setShowAuthAlert] = useState(false);

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

  if (!product) return null;

  const isCreator = currentUser && (restaurant?.creatorId === currentUser.id || currentUser.isAdmin);
  const displayImage = product.image || DEFAULT_PRODUCT_IMAGE;
  const imageUrl = displayImage.startsWith('http') ? displayImage : `${BASE_URL}${displayImage}`;

  const handleAddToOrder = async () => {
    if (!currentUser || currentUser.isGuest) {
      setShowAuthAlert(true);
      return;
    }
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

      const payload = {
        name: name.trim(),
        price: parseFloat(price),
        description: description.trim(),
        image: image.trim() || undefined
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
    <>
      <ProductDetailModalView
        visible={visible}
        onClose={onClose}
        isCreator={isCreator}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        error={error}
        name={name}
        setName={setName}
        price={price}
        setPrice={setPrice}
        description={description}
        setDescription={setDescription}
        image={image}
        setImage={setImage}
        submitting={submitting}
        handleDeleteProduct={handleDeleteProduct}
        product={product}
        imageUrl={imageUrl}
        handleSaveProduct={handleSaveProduct}
        handleAddToOrder={handleAddToOrder}
      />
      <CustomAlertModal
        visible={showAuthAlert}
        title="Authentication Required"
        message="Please sign in to add items to your cart."
        onClose={() => setShowAuthAlert(false)}
        buttons={[
          {
            text: 'OK',
            onPress: () => setShowAuthAlert(false),
            style: 'danger'
          }
        ]}
      />
    </>
  );
}
