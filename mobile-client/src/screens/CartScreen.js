import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import createStyles from '../styles/CartScreen.styles';
import { COLORS } from '../theme/theme';

export default function CartScreen({ navigation }) {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const { currentUser, logout } = useAuth();
  const {
    cartItems,
    cartRestaurant,
    cartCalculation,
    isCalculating,
    conflictItem,
    successItem,
    clearSuccess,
    updateQuantity,
    removeFromCart,
    clearCart,
    checkout,
    confirmConflict,
    cancelConflict,
  } = useCart();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  const handleCheckout = async () => {
    if (!currentUser) {
      navigation.navigate('Login');
      return;
    }

    if (cartItems.length === 0 || !cartRestaurant) return;

    try {
      setLoading(true);
      setCheckoutError('');
      await checkout();
      setSuccess(true);
    } catch (err) {
      setCheckoutError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccess = () => {
    setSuccess(false);
    clearCart();
    // Switch to HomeTab
    navigation.navigate('HomeTab');
  };

  const renderCartItem = ({ item }) => {
    // Retrieve calculated price from server calculation cache if available
    const itemCalculation = cartCalculation.items?.find(i => i.id === (item.id || item._id));
    const calculatedPrice = itemCalculation ? itemCalculation.price : item.price;

    return (
      <View style={styles.cartItemCard}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.itemPrice}>₪{parseFloat(calculatedPrice).toFixed(2)}</Text>
        </View>

        <View style={styles.itemActions}>
          <View style={styles.qtyContainer}>
            <TouchableOpacity 
              style={styles.qtyButton}
              onPress={() => updateQuantity(item.id || item._id, item.quantity - 1)}
            >
              <Ionicons name="remove" size={16} color={theme.text} />
            </TouchableOpacity>
            
            <Text style={styles.qtyText}>{item.quantity}</Text>
            
            <TouchableOpacity 
              style={styles.qtyButton}
              onPress={() => updateQuantity(item.id || item._id, item.quantity + 1)}
            >
              <Ionicons name="add" size={16} color={theme.text} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => removeFromCart(item.id || item._id)}
          >
            <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // 1. User not logged in or guest state
  if (!currentUser || currentUser.isGuest) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Cart</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="lock-closed-outline" size={80} color={theme.textSecondary} />
          <Text style={styles.emptyTitle}>Sign In Required</Text>
          <Text style={styles.emptyText}>
            You must be signed in to view your cart and order.
          </Text>
          <TouchableOpacity 
            style={styles.browseButton}
            onPress={logout}
          >
            <Text style={styles.browseButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // 2. Success Screen Overlay
  if (success) {
    return (
      <View style={styles.successOverlay}>
        <Ionicons name="checkmark-circle" size={100} color={COLORS.success} />
        <Text style={styles.successTitle}>Order Placed!</Text>
        <Text style={styles.successText}>
          Your order from {cartRestaurant?.name} has been successfully placed. You can view its progress in your Order History!
        </Text>
        <TouchableOpacity style={styles.successButton} onPress={handleCloseSuccess}>
          <Text style={styles.successButtonText}>Awesome</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cart</Text>
        {cartItems.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={clearCart}>
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.container}>
        {cartItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={80} color={theme.textSecondary} />
            <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
            <Text style={styles.emptyText}>
              Browse through restaurants and add delicious foods to start your order!
            </Text>
            <TouchableOpacity 
              style={styles.browseButton}
              onPress={() => navigation.navigate('HomeTab')}
            >
              <Text style={styles.browseButtonText}>Browse Restaurants</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.flexContainer}>
            <FlatList
              data={cartItems}
              keyExtractor={(item) => item.id || item._id}
              renderItem={renderCartItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={() => (
                <View style={styles.restaurantHeader}>
                  <Ionicons name="restaurant-outline" size={18} color={theme.textSecondary} />
                  <Text style={styles.restaurantHeaderText}>
                    Ordering from {cartRestaurant?.name}
                  </Text>
                </View>
              )}
            />

            {/* Sticky Invoice Footer */}
            <View style={styles.footer}>
              {checkoutError ? (
                <Text style={styles.checkoutErrorText}>
                  {checkoutError}
                </Text>
              ) : null}



              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Sum</Text>
                {isCalculating ? (
                  <ActivityIndicator size="small" color={COLORS.primary} />
                ) : (
                  <Text style={styles.totalValue}>
                    ₪{(cartCalculation.totalPrice || 0).toFixed(2)}
                  </Text>
                )}
              </View>

              <TouchableOpacity 
                style={[styles.checkoutButton, loading && styles.disabledButton]} 
                onPress={handleCheckout}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.checkoutButtonText}>Place Order</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Conflict Modal Overlay */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={conflictItem !== null}
        onRequestClose={cancelConflict}
      >
        <View style={styles.conflictOverlay}>
          <View style={styles.conflictContainer}>
            <View style={styles.conflictHeader}>
              <Ionicons name="warning" size={24} color={COLORS.warning} />
              <Text style={styles.conflictTitle}>Clear Cart?</Text>
            </View>
            <Text style={styles.conflictText}>
              You already have items from <Text style={styles.boldText}>{cartRestaurant?.name}</Text> in your cart.
              Would you like to clear your current cart and start a new order from <Text style={styles.boldText}>{conflictItem?.restaurant?.name}</Text>?
            </Text>
            <View style={styles.conflictButtonsRow}>
              <TouchableOpacity style={styles.conflictCancel} onPress={cancelConflict}>
                <Text style={styles.conflictCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.conflictConfirm} onPress={confirmConflict}>
                <Text style={styles.conflictConfirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal Overlay */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={successItem !== null}
        onRequestClose={clearSuccess}
      >
        <View style={styles.conflictOverlay}>
          <View style={styles.conflictContainer}>
            <View style={styles.conflictHeader}>
              <Ionicons name="checkmark-circle" size={28} color={COLORS.success || '#10b981'} />
              <Text style={styles.conflictTitle}>Added to Cart</Text>
            </View>
            <Text style={styles.conflictText}>
              <Text style={styles.boldText}>{successItem?.name}</Text> has been added to your order.
            </Text>
            <View style={styles.conflictButtonsRow}>
              <TouchableOpacity style={[styles.conflictConfirm, styles.successConfirmButton]} onPress={clearSuccess}>
                <Text style={styles.conflictConfirmText}>Awesome</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
