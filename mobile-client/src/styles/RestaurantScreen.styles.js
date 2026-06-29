import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, ActivityIndicator, ImageBackground, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../theme/theme';
import { useTheme } from '../contexts/ThemeContext';
import { BASE_URL } from '../services/api';
import ProductDetailModal from '../components/restaurant/ProductDetailModal';
import EditRestaurantModal from '../components/restaurant/EditRestaurantModal';
import AddProductModal from '../components/restaurant/AddProductModal';

const DEFAULT_RESTAURANT_IMAGE = "/api/uploads/restaurants/default.webp";
const DEFAULT_PRODUCT_IMAGE = "/api/uploads/products/default.webp";

export const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
  },
  loadingText: {
    ...FONTS.body1,
    color: theme.textSecondary,
    marginTop: SIZES.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
    padding: SIZES.lg,
  },
  errorText: {
    ...FONTS.h3,
    color: theme.textSecondary,
    textAlign: 'center',
    marginTop: SIZES.md,
    marginBottom: SIZES.lg,
  },
  errorBackButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radius,
  },
  errorBackButtonText: {
    ...FONTS.body1,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  heroImage: {
    width: '100%',
    height: 200,
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'space-between',
    padding: SIZES.md,
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SIZES.xs,
    marginTop: SIZES.xs,
  },
  detailsCard: {
    backgroundColor: theme.surface,
    borderTopLeftRadius: SIZES.radius * 1.5,
    borderTopRightRadius: SIZES.radius * 1.5,
    marginTop: -SIZES.radius * 1.5,
    padding: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  restaurantName: {
    ...FONTS.h1,
    color: theme.text,
    marginBottom: SIZES.xs,
  },
  categoryBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radius / 2,
    alignSelf: 'flex-start',
    marginBottom: SIZES.sm,
  },
  categoryBadgeText: {
    ...FONTS.caption,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  restaurantDesc: {
    ...FONTS.body1,
    color: theme.textSecondary,
    lineHeight: 22,
  },
  menuTitle: {
    ...FONTS.h3,
    color: theme.text,
    marginHorizontal: SIZES.md,
    marginTop: SIZES.lg,
    marginBottom: SIZES.sm,
  },
  listContent: {
    paddingBottom: SIZES.xxl,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: theme.surface,
    marginHorizontal: SIZES.md,
    marginVertical: SIZES.xs,
    padding: SIZES.md,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: theme.border,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
    marginRight: SIZES.md,
  },
  productName: {
    ...FONTS.h3,
    color: theme.text,
    marginBottom: SIZES.xs,
  },
  productPrice: {
    ...FONTS.body1,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginBottom: SIZES.xs,
  },
  productDesc: {
    ...FONTS.caption,
    color: theme.textSecondary,
    lineHeight: 16,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: SIZES.radius,
  },
  emptyMenuContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.xl * 2,
  },
  emptyMenuText: {
    ...FONTS.body1,
    color: theme.textSecondary,
    marginTop: SIZES.sm,
    textAlign: 'center',
  },
  heroOverlayCreator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  restaurantNameCreator: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
    flex: 1,
    margin: 0,
  },
  addProductButton: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addProductButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 12,
  }
});

export default function RestaurantScreenView({
  navigation,
  loading,
  error,
  restaurant,
  products,
  currentUser,
  selectedProduct,
  setSelectedProduct,
  modalVisible,
  setModalVisible,
  editModalVisible,
  setEditModalVisible,
  addProductModalVisible,
  setAddProductModalVisible,
  handleProductsRefresh,
  handleRestaurantUpdated,
  handleProductPress
}) {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

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

  const isCreator = currentUser && (restaurant.creatorId === currentUser.id || currentUser.isAdmin);

  const renderHeader = () => {
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
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => setEditModalVisible(true)}
              >
                <Ionicons name="create-outline" size={24} color="#ffffff" />
              </TouchableOpacity>
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
    </SafeAreaView>
  );
}
