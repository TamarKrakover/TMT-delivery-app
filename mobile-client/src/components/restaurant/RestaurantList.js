import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import RestaurantCard from './RestaurantCard';
import { SIZES, FONTS } from '../../theme/theme';
import { useTheme } from '../../contexts/ThemeContext';

export default function RestaurantList({ restaurants, onRestaurantPress, listHeaderComponent, listFooterComponent }) {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  
  // Let FlatList handle the empty state so headers/footers still render correctly
  // without crashing if listHeaderComponent is a React Element instead of a function.

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
      ListFooterComponent={listFooterComponent}
      ListEmptyComponent={
        <View style={styles.emptyListContainer}>
          <Text style={styles.emptyListText}>
            No restaurants found
          </Text>
        </View>
      }
    />
  );
}

const createStyles = (theme) => StyleSheet.create({
  listContent: {
    paddingBottom: SIZES.xl,
  },
  emptyListContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyListText: {
    ...FONTS.body1,
    color: theme.textSecondary,
    textAlign: 'center',
  }
});
