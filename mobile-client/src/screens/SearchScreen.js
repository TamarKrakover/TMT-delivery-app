import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import createStyles from '../styles/SearchScreen.styles';
import { useTheme } from '../contexts/ThemeContext';
import { restaurantService, userService } from '../services/api';
import { calculateDistance } from '../utils/distance';
import RestaurantList from '../components/restaurant/RestaurantList';
import ProductDetailModal from '../components/restaurant/ProductDetailModal';
import { COLORS } from '../theme/theme';

export default function SearchScreen({ navigation, userSession }) {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [loading, setLoading] = useState(false); // don't load initially
  const [fullUser, setFullUser] = useState(null);
  const [activeTab, setActiveTab] = useState('restaurants'); // 'restaurants' or 'products'
  const [restaurantDict, setRestaurantDict] = useState({});
  
  // Product modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Local pagination
  const [visibleCount, setVisibleCount] = useState(10);

  // Fetch full user for distance calculation
  useEffect(() => {
    const fetchUser = async () => {
      if (userSession?.id) {
        try {
          const user = await userService.getUserById(userSession.id);
          setFullUser(user);
        } catch (error) {
          console.error("Failed to fetch user in search:", error);
        }
      }
    };
    fetchUser();
  }, [userSession]);

  // Fetch all restaurants to build a dictionary for product mappings
  const fetchRestaurantsForMapping = useCallback(async () => {
    try {
      const allRests = await restaurantService.getAll();
      const dict = {};
      allRests.forEach(r => { dict[r.id] = r.name; });
      setRestaurantDict(dict);
    } catch (e) {
      console.error("Failed to fetch restaurants for mapping", e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRestaurantsForMapping();
    }, [fetchRestaurantsForMapping])
  );

  // Main search logic
  useEffect(() => {
    const performSearch = async () => {
      setLoading(true);
      try {
        let results = [];
        if (searchQuery.trim() === '') {
          results = []; // Don't fetch anything initially
        } else {
          const data = await restaurantService.search(searchQuery);
          // Show both restaurants and products
          results = data || [];
        }
        setRestaurants(results);
        setVisibleCount(10); // Reset pagination on new search
      } catch (error) {
        console.error("Search failed:", error);
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search slightly
    const timeoutId = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Map distances, filter by tab, and apply local pagination
  useEffect(() => {
    let processed = restaurants;

    if (fullUser?.location) {
      processed = processed.map(r => {
        if (r.location) {
          const dist = calculateDistance(fullUser.location, r.location);
          return { ...r, distance: dist };
        }
        // Attach restaurantName if it's a product
        if (r.price !== undefined && r.restaurantId && restaurantDict[r.restaurantId]) {
          return { ...r, restaurantName: restaurantDict[r.restaurantId] };
        }
        return r;
      });
    } else {
      // Even if no fullUser, attach restaurantName
      processed = processed.map(r => {
        if (r.price !== undefined && r.restaurantId && restaurantDict[r.restaurantId]) {
          return { ...r, restaurantName: restaurantDict[r.restaurantId] };
        }
        return r;
      });
    }

    // Filter based on active tab
    // Items with 'price' are considered products. Items with 'category' or 'location' are restaurants.
    if (activeTab === 'restaurants') {
      processed = processed.filter(item => item.location !== undefined || item.category !== undefined);
    } else {
      processed = processed.filter(item => item.price !== undefined);
    }

    setDisplayedItems(processed.slice(0, visibleCount));
  }, [restaurants, visibleCount, fullUser, activeTab]);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 10);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={theme.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search restaurants..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {searchQuery.trim() !== '' && !loading && (
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'restaurants' && styles.activeTabButton]}
            onPress={() => { setActiveTab('restaurants'); setVisibleCount(10); }}
          >
            <Text style={[styles.tabText, activeTab === 'restaurants' && styles.activeTabText]}>
              Restaurants
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'products' && styles.activeTabButton]}
            onPress={() => { setActiveTab('products'); setVisibleCount(10); }}
          >
            <Text style={[styles.tabText, activeTab === 'products' && styles.activeTabText]}>
              Products
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.content}>
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : searchQuery.trim() === '' ? (
          <View style={styles.centerContainer}>
            <Ionicons name="search-outline" size={48} color={theme.textSecondary} style={{ opacity: 0.5, marginBottom: 10 }} />
            <Text style={[styles.emptyText, { marginTop: 0 }]}>Type something to find restaurants or products</Text>
          </View>
        ) : (
          <RestaurantList 
            restaurants={displayedItems}
            onRestaurantPress={(item) => {
              if (activeTab === 'restaurants') {
                navigation.navigate('Restaurant', { restaurant: item });
              } else {
                setSelectedProduct(item);
                setModalVisible(true);
              }
            }}
            listHeaderComponent={() => (
              displayedItems.length === 0 && !loading ? (
                <Text style={styles.emptyText}>No {activeTab} found for "{searchQuery}"</Text>
              ) : null
            )}
            listFooterComponent={() => (
              !loading && displayedItems.length < restaurants.filter(item => activeTab === 'restaurants' ? (item.location || item.category) : item.price).length ? (
                <TouchableOpacity 
                  style={{ padding: 15, alignItems: 'center', backgroundColor: theme.surface, marginVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: theme.border }} 
                  onPress={handleLoadMore}
                >
                  <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Load More</Text>
                </TouchableOpacity>
              ) : null
            )}
          />
        )}
      </View>

      <ProductDetailModal
        visible={modalVisible}
        product={selectedProduct}
        restaurant={selectedProduct ? { id: selectedProduct.restaurantId, name: selectedProduct.restaurantName } : null}
        onClose={() => {
          setModalVisible(false);
          setSelectedProduct(null);
        }}
      />
    </SafeAreaView>
  );
}
