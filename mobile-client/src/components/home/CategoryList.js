import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import createStyles from '../../styles/CategoryList.styles';
import { useTheme } from '../../contexts/ThemeContext';
import { BASE_URL } from '../../services/api';

export default function CategoryList({ categories, selectedCategory, onSelectCategory, totalRestaurants }) {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  if (!categories || categories.length === 0) {
    return null;
  }

  // Prepend the "All" category automatically like in the web app
  const displayCategories = [
    { name: 'All', image: '/api/uploads/categories/all.webp', count: totalRestaurants || 0 },
    ...categories
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Categories</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {displayCategories.map((cat, index) => {
          const isSelected = selectedCategory === cat.name;
          
          // Construct full image URL
          const imageUrl = cat.image?.startsWith('http') 
            ? cat.image 
            : `${BASE_URL}${cat.image}`;

          return (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.categoryItem,
                isSelected && styles.categoryItemSelected
              ]}
              onPress={() => onSelectCategory(cat.name)}
              activeOpacity={0.7}
            >
              <View style={styles.imageContainer}>
                {cat.image ? (
                  <Image 
                    source={{ uri: imageUrl }} 
                    style={styles.categoryImage} 
                    resizeMode="cover"
                    defaultSource={require('../../../assets/icon.png')}
                  />
                ) : (
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 24, color: theme.textSecondary }}>{cat.name.charAt(0)}</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.infoContainer}>
                <Text style={[
                  styles.categoryName,
                  isSelected && styles.categoryNameSelected
                ]} numberOfLines={1}>
                  {cat.name}
                </Text>
                <Text style={styles.categoryPlaces}>
                  {cat.count !== undefined ? `${cat.count} places` : 'Various'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
