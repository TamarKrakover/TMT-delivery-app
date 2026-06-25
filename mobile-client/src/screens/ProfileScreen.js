import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { orderService, restaurantService, productService, BASE_URL } from '../services/api';
import createStyles from '../styles/ProfileScreen.styles';
import { COLORS } from '../theme/theme';

export default function ProfileScreen({ onLogout }) {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const { currentUser, logout } = useAuth();
  
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [productsCache, setProductsCache] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrderHistory = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      setError('');

      // Fetch orders and restaurants in parallel
      const [ordersData, restaurantsData] = await Promise.all([
        orderService.getAll().catch(() => []),
        restaurantService.getAll().catch(() => [])
      ]);

      // Filter out active cart (Pending) and sort newest first
      const completedOrders = ordersData
        .filter(order => order.status !== 'Pending')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Fetch products for all unique restaurants in orders to construct detailed item list
      const uniqueRestIds = [...new Set(completedOrders.map(o => o.restaurantId))];
      const productsPromises = uniqueRestIds.map(id => productService.getByRestaurantId(id).catch(() => []));
      const productsResults = await Promise.all(productsPromises);
      
      const newProductsCache = {};
      uniqueRestIds.forEach((id, index) => {
        newProductsCache[id] = productsResults[index];
      });

      setProductsCache(newProductsCache);
      setOrders(completedOrders);
      setRestaurants(restaurantsData);
    } catch (err) {
      console.error('Failed to load profile order history:', err);
      setError('Failed to load order history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, [currentUser]);

  const getRestaurantName = (restaurantId) => {
    const found = restaurants.find(r => (r.id || r._id) === restaurantId);
    return found ? found.name : 'Unknown Restaurant';
  };

  const handleLogoutPress = async () => {
    await logout();
    if (onLogout) {
      onLogout();
    }
  };

  const renderHeader = () => {
    if (!currentUser) return null;

    const displayImage = currentUser.profilePic || currentUser.profilePicture;
    const imageUrl = displayImage && (displayImage.startsWith('http') ? displayImage : `${BASE_URL}${displayImage}`);

    return (
      <View style={styles.headerContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {(currentUser.displayName || currentUser.name || currentUser.username || 'U').charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <Text style={styles.profileName}>{currentUser.displayName || currentUser.name || currentUser.username}</Text>
        <Text style={styles.profileUsername}>@{currentUser.username}</Text>
      </View>
    );
  };

  const renderOrderCard = ({ item }) => {
    // Group item frequencies for display
    const counts = {};
    item.productIds?.forEach(id => {
      counts[id] = (counts[id] || 0) + 1;
    });

    const restaurantProducts = productsCache[item.restaurantId] || [];
    const detailedItems = [];
    
    for (const [pid, qty] of Object.entries(counts)) {
      const product = restaurantProducts.find(p => (p.id || p._id) === pid);
      detailedItems.push({
        id: pid,
        name: product ? product.name : 'Unknown Product',
        price: product ? product.price : 0,
        quantity: qty
      });
    }

    const formattedDate = new Date(item.createdAt).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const isProcessing = item.status === 'Processing';

    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderRestaurantName}>{getRestaurantName(item.restaurantId)}</Text>
          <View style={[
            styles.statusBadge, 
            isProcessing ? styles.statusBadgeProcessing : styles.statusBadgeDone
          ]}>
            <Text style={[
              styles.statusText, 
              { color: isProcessing ? COLORS.warning : COLORS.success }
            ]}>
              {item.status}
            </Text>
          </View>
        </View>

        <Text style={styles.orderDate}>{formattedDate}</Text>
        
        <View style={styles.divider} />
        
        {detailedItems.map(detailedItem => (
          <View key={detailedItem.id} style={styles.orderItemRow}>
            <Text style={styles.orderItemName} numberOfLines={1}>
              {detailedItem.name} <Text style={{ color: theme.textSecondary }}>x{detailedItem.quantity}</Text>
            </Text>
            <Text style={styles.orderItemPrice}>
              ₪{(detailedItem.price * detailedItem.quantity).toFixed(2)}
            </Text>
          </View>
        ))}

        <View style={styles.orderTotalRow}>
          <Text style={styles.orderTotalLabel}>Total Price</Text>
          <Text style={styles.orderTotalValue}>₪{item.totalPrice?.toFixed(2)}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id || item._id}
        renderItem={renderOrderCard}
        ListHeaderComponent={() => (
          <View>
            {renderHeader()}
            <Text style={styles.sectionTitle}>Order History</Text>
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={theme.text} />
              </View>
            )}
            {error ? (
              <View style={styles.emptyContainer}>
                <Text style={{ color: COLORS.danger }}>{error}</Text>
              </View>
            ) : null}
          </View>
        )}
        ListFooterComponent={() => (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress}>
            <Ionicons name="log-out-outline" size={20} color="#ffffff" />
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => {
          if (loading) return null;
          return (
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={48} color={theme.textSecondary} />
              <Text style={styles.emptyText}>No past orders found.</Text>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}
