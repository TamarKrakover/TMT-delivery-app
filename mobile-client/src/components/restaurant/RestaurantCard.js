import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import createStyles from '../../styles/RestaurantCard.styles';
import { useTheme } from '../../contexts/ThemeContext';
import { FONTS } from '../../theme/theme';
import { BASE_URL } from '../../services/api';

const DEFAULT_RESTAURANT_IMAGE = "/api/uploads/restaurants/default.webp";

export default function RestaurantCard({ restaurant, onPress }) {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  if (!restaurant) return null;

  const displayImage = restaurant.image || DEFAULT_RESTAURANT_IMAGE;
  const imageUrl = displayImage.startsWith('http') ? displayImage : `${BASE_URL}${displayImage}`;

  return (
    <TouchableOpacity 
      style={styles.cardContainer}
      activeOpacity={0.8}
      onPress={() => onPress && onPress(restaurant)}
    >
      <View style={styles.imageWrapper}>
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.restaurantImage}
          defaultSource={require('../../../assets/icon.png')}
        />
        {restaurant.category ? (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{restaurant.category}</Text>
          </View>
        ) : restaurant.price ? (
          <View style={[styles.categoryBadge, { backgroundColor: theme.primary }]}>
            <Text style={[styles.categoryBadgeText, { fontWeight: 'bold' }]}>${restaurant.price.toFixed(2)}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.nameText} numberOfLines={1}>{restaurant.name}</Text>
        {restaurant.restaurantName ? (
          <Text style={{ ...FONTS.body2, color: theme.primary, marginBottom: 2 }}>
            from {restaurant.restaurantName}
          </Text>
        ) : null}
        {restaurant.description ? (
          <Text style={styles.descriptionText} numberOfLines={2}>
            {restaurant.description}
          </Text>
        ) : null}
        
        <View style={styles.footerRow}>
          {restaurant.distance !== null && restaurant.distance !== undefined && (
            <Text style={styles.distanceText}>
              📍 {restaurant.distance.toFixed(1)} km
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
