import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../theme/theme';
import { useTheme } from '../contexts/ThemeContext';
import RestaurantList from '../components/restaurant/RestaurantList';
import AddRestaurantModal from '../components/restaurant/AddRestaurantModal';

export const createStyles = (theme) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    backgroundColor: theme.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  backButton: {
    padding: SIZES.xs,
    marginRight: SIZES.sm,
  },
  headerTitle: {
    ...FONTS.h2,
    color: theme.text,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xl,
    marginTop: SIZES.xxl,
  },
  emptyTitle: {
    ...FONTS.h2,
    color: theme.text,
    marginTop: SIZES.md,
    marginBottom: SIZES.xs,
  },
  emptyText: {
    ...FONTS.body2,
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  listContent: {
    paddingBottom: 100,
  },
  headerRow: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    backgroundColor: theme.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  headerLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonPadding: {
    padding: 4,
  },
  emptyActionButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  emptyActionButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  }
});

export default function MyRestaurantsScreenView({
  navigation,
  loading,
  error,
  restaurants,
  modalVisible,
  setModalVisible,
  fetchMyRestaurants,
  handleRestaurantPress
}) {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const renderHeader = () => (
    <View style={styles.headerRow}>
      <View style={styles.headerLeftRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Restaurants</Text>
      </View>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButtonPadding}>
        <Ionicons name="add" size={28} color={theme.text} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {renderHeader()}
      
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.text} />
          </View>
        ) : error ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="alert-circle-outline" size={48} color={theme.textSecondary} />
            <Text style={styles.emptyText}>{error}</Text>
          </View>
        ) : restaurants.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="restaurant-outline" size={60} color={theme.textSecondary} />
            <Text style={styles.emptyTitle}>No Restaurants Yet</Text>
            <Text style={styles.emptyText}>
              You haven't added any restaurants yet.
            </Text>
            <TouchableOpacity 
              style={styles.emptyActionButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.emptyActionButtonText}>Add Your First Restaurant</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <RestaurantList 
            restaurants={restaurants}
            onRestaurantPress={handleRestaurantPress}
          />
        )}
      </View>

      <AddRestaurantModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onRestaurantAdded={fetchMyRestaurants}
      />
    </SafeAreaView>
  );
}
