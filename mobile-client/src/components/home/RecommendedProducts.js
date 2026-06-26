import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import createStyles from '../../styles/RecommendedProducts.styles';
import { useTheme } from '../../contexts/ThemeContext';
import { BASE_URL } from '../../services/api';

const DEFAULT_PRODUCT_IMAGE = "/api/uploads/products/default.webp";

export default function RecommendedProducts({ recommendations, lastViewedProduct, onPress }) {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  if (!lastViewedProduct) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>check out your taste!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        if you liked {lastViewedProduct.name} you might also like
      </Text>
      
      {!recommendations || recommendations.length === 0 ? (
        <Text style={styles.emptyText}>No recommended products found.</Text>
      ) : (
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
                key={`${product?.id || product?._id || index}`} 
                style={styles.cardContainer}
                activeOpacity={0.8}
                onPress={() => onPress && onPress(product, restaurant)}
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
      )}
    </View>
  );
}
