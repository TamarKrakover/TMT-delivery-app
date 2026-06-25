import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import RestaurantCard from './RestaurantCard';
import { SIZES, FONTS } from '../../theme/theme';
import { useTheme } from '../../contexts/ThemeContext';

export default function RestaurantList({ restaurants, onRestaurantPress, listHeaderComponent }) {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  
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

const createStyles = (theme) => StyleSheet.create({
  listContent: {
    paddingBottom: SIZES.xl,
  },
  emptyContainer: {
    flex: 1,
    paddingBottom: SIZES.xl,
  },
  emptyText: {
    ...FONTS.body1,
    color: theme.textSecondary,
    textAlign: 'center',
    marginTop: SIZES.xl,
  }
});
