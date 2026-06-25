import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import RestaurantCard from './RestaurantCard';
import { SIZES, FONTS, lightTheme } from '../../theme/theme';

export default function RestaurantList({ restaurants, onRestaurantPress, listHeaderComponent }) {
  
  if (!restaurants || restaurants.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        {listHeaderComponent && listHeaderComponent()}
        <Text style={styles.emptyText}>No restaurants found.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={restaurants}
      keyExtractor={(item) => item.id || item._id}
      renderItem={({ item }) => (
        <RestaurantCard 
          restaurant={item} 
          onPress={onRestaurantPress}
        />
      )}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={listHeaderComponent}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: SIZES.xl,
  },
  emptyContainer: {
    flex: 1,
    paddingBottom: SIZES.xl,
  },
  emptyText: {
    ...FONTS.body1,
    color: lightTheme.textSecondary,
    textAlign: 'center',
    marginTop: SIZES.xl,
  }
});
