import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { BASE_URL, productService } from '../../services/api';
import { COLORS, SIZES, FONTS } from '../../theme/theme';
import { useTheme } from '../../contexts/ThemeContext';

const DEFAULT_PRODUCT_IMAGE = "/api/uploads/products/default.webp";

export default function ProductDetailModal({ visible, product, restaurant, onClose }) {
  const { addToCart } = useCart();
  const { currentUser, updateLastViewedProduct } = useAuth();
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  useEffect(() => {
    if (visible && product && restaurant && currentUser) {
      const restId = restaurant.id || restaurant._id;
      const prodId = product.id || product._id;
      
      // Trigger backend log view (which saves interaction to C++ TCP recommendation server)
      productService.getById(restId, prodId).catch((err) => {
        console.error('Failed to log product view on backend:', err);
      });

      updateLastViewedProduct(product).catch((err) => {
        console.error('Failed to log last viewed product locally:', err);
      });
    }
  }, [visible, product, restaurant, currentUser]);

  if (!product) return null;

  const displayImage = product.image || DEFAULT_PRODUCT_IMAGE;
  const imageUrl = displayImage.startsWith('http') ? displayImage : `${BASE_URL}${displayImage}`;

  const handleAddToOrder = async () => {
    await addToCart(product, restaurant);
    onClose();
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

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: theme.border }]}>
            <TouchableOpacity style={styles.addButton} onPress={handleAddToOrder}>
              <Ionicons name="cart" size={20} color="#ffffff" style={{ marginRight: 8 }} />
              <Text style={styles.addButtonText}>Add to Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (theme) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: theme.surface,
    borderTopLeftRadius: SIZES.radius * 2,
    borderTopRightRadius: SIZES.radius * 2,
    maxHeight: '85%',
    minHeight: '50%',
    paddingBottom: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: theme.surface,
    borderRadius: 20,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  productImage: {
    width: '100%',
    height: 250,
    borderTopLeftRadius: SIZES.radius * 2,
    borderTopRightRadius: SIZES.radius * 2,
  },
  noImageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: theme.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: SIZES.radius * 2,
    borderTopRightRadius: SIZES.radius * 2,
  },
  noImageText: {
    ...FONTS.caption,
    color: theme.textSecondary,
    marginTop: 8,
  },
  infoContainer: {
    padding: SIZES.md,
  },
  productName: {
    ...FONTS.h2,
    color: theme.text,
    marginBottom: SIZES.xs,
  },
  productPrice: {
    ...FONTS.h3,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginBottom: SIZES.md,
  },
  divider: {
    height: 1,
    backgroundColor: theme.border,
    marginVertical: SIZES.md,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: theme.text,
    marginBottom: SIZES.xs,
  },
  productDescription: {
    ...FONTS.body1,
    color: theme.textSecondary,
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: SIZES.md,
    paddingTop: SIZES.md,
    borderTopWidth: 1,
    backgroundColor: theme.surface,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: SIZES.radius,
  },
  addButtonText: {
    ...FONTS.body1,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
