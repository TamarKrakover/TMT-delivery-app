import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import styles from '../../styles/CategoryList.styles';
import { BASE_URL } from '../../services/api';

export default function CategoryList({ categories, selectedCategory, onSelectCategory }) {
  if (!categories || categories.length === 0) {
    return null;
  }

  // Prepend the "All" category automatically like in the web app
  const displayCategories = [
    { name: 'All', image: '/api/uploads/categories/all.webp' },
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
              style={styles.categoryItem}
              onPress={() => onSelectCategory(cat.name)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.imageContainer, 
                isSelected && styles.imageContainerSelected
              ]}>
                {cat.image ? (
                  <Image 
                    source={{ uri: imageUrl }} 
                    style={styles.categoryImage} 
                    defaultSource={require('../../../assets/icon.png')}
                  />
                ) : (
                  <Text style={styles.categoryName}>{cat.name.charAt(0)}</Text>
                )}
              </View>
              <Text style={[
                styles.categoryName,
                isSelected && styles.categoryNameSelected
              ]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
