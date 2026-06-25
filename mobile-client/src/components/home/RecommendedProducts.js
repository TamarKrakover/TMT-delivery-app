import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import createStyles from '../../styles/RecommendedProducts.styles';
import { useTheme } from '../../contexts/ThemeContext';
import { BASE_URL } from '../../services/api';

const DEFAULT_PRODUCT_IMAGE = "/api/uploads/products/default.webp";

export default function RecommendedProducts({ recommendations, lastViewedProduct }) {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        If you liked {lastViewedProduct?.name || 'that'}, you might also like:
      </Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {recommendations.map((item, index) => {
          const product = item.product;
          const restaurant = item.restaurant;
          const displayImage = product?.image || DEFAULT_PRODUCT_IMAGE;
          const imageUrl = displayImage.startsWith('http') ? displayImage : `${BASE_URL}${displayImage}`;

          return (
            <TouchableOpacity 
              key={`${product?._id || index}`} 
              style={styles.cardContainer}
              activeOpacity={0.8}
            >
              <View style={styles.imageWrapper}>
                <Image 
                  source={{ uri: imageUrl }} 
                  style={styles.productImage}
                  defaultSource={require('../../../assets/icon.png')}
                />
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.nameText} numberOfLines={1}>{product?.name}</Text>
                <Text style={styles.priceText}>₪{product?.price}</Text>
                {restaurant && (
                  <Text style={styles.restaurantText} numberOfLines={1}>
                    From {restaurant.name}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
