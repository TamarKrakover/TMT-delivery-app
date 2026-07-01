import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, Modal, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../theme/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { restaurantService, categoryService, uploadService, BASE_URL } from '../../services/api';
import { createStyles } from '../../styles/EditRestaurantModal.styles';
import * as ImagePicker from 'expo-image-picker';

export default function EditRestaurantModal({ visible, onClose, restaurant, onRestaurantUpdated }) {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    if (visible && restaurant) {
      setName(restaurant.name || '');
      setDescription(restaurant.description || '');
      setCategory(restaurant.category || '');
      setImage(restaurant.image || '');
      setLat(restaurant.location?.lat ? String(restaurant.location.lat) : '');
      setLng(restaurant.location?.lng ? String(restaurant.location.lng) : '');
      setFormError(null);
      fetchCategories();
    }
  }, [visible, restaurant]);

  const fetchCategories = async () => {
    try {
      const cats = await categoryService.getAll();
      setAvailableCategories(cats || []);
    } catch (e) {
    }
  };

  const pickImage = async (useCamera = false) => {
    try {
      let result;
      if (useCamera) {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
          Alert.alert('Permission needed', 'You need to grant camera permissions to take a picture.');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      } else {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
          Alert.alert('Permission needed', 'You need to grant gallery permissions to select a picture.');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
        setFormError(null);
      }
    } catch (err) {
      setFormError('Failed to select image.');
    }
  };

  const handleEditRestaurant = async () => {
    if (!name.trim()) {
      setFormError('Restaurant name is required.');
      return;
    }
    if (!category.trim()) {
      setFormError('Category is required.');
      return;
    }
    if (!lat.trim() || !lng.trim()) {
      setFormError('Latitude and Longitude are required.');
      return;
    }

    try {
      setSubmitting(true);
      setFormError(null);
      
      let finalImageUrl = image && image.trim() !== '' ? image.trim() : (restaurant.image || '');
      if (image && !image.startsWith('/api/') && !image.startsWith('http://') && !image.startsWith('https://')) {
        const uploadResponse = await uploadService.uploadImage(image);
        if (uploadResponse && uploadResponse.url) {
          finalImageUrl = uploadResponse.url;
        }
      }

      const payload = {
        name: name.trim(),
        description: description.trim(),
        category: category.trim(),
        image: finalImageUrl || undefined,
      };

      const parsedLat = parseFloat(lat);
      const parsedLng = parseFloat(lng);
      if (isNaN(parsedLat) || isNaN(parsedLng)) {
        setFormError('Latitude and Longitude must be valid numbers.');
        setSubmitting(false);
        return;
      }
      payload.location = { lat: parsedLat, lng: parsedLng };

      const restId = restaurant.id || restaurant._id;
      await restaurantService.update(restId, payload);
      
      if (onRestaurantUpdated) {
        onRestaurantUpdated(payload);
      }
      onClose();
    } catch (err) {
      setFormError(err.message || 'Failed to update restaurant. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const previewUri = image
    ? (image.startsWith('http') || image.startsWith('file://') || image.startsWith('content://') 
      ? image 
      : `${BASE_URL}${image}`)
    : null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Restaurant Details</Text>
          
          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollMargin}>
            {formError && <Text style={styles.errorText}>{formError}</Text>}
            
            <Text style={styles.label}>Restaurant Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter restaurant name"
              placeholderTextColor={theme.textSecondary}
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Category *</Text>
            
            {availableCategories.length > 0 ? (
              <View style={styles.suggestionsContainer}>
                {availableCategories.map((cat, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.categoryChip,
                      category.toLowerCase() === cat.name.toLowerCase() && styles.categoryChipSelected
                    ]}
                    onPress={() => setCategory(cat.name)}
                  >
                    <Text style={[
                      styles.categoryChipText,
                      category.toLowerCase() === cat.name.toLowerCase() && styles.categoryChipTextSelected
                    ]}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text style={[styles.errorText, { textAlign: 'left', marginBottom: 12 }]}>
                No categories available. Please add a category first.
              </Text>
            )}

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter description"
              placeholderTextColor={theme.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline={true}
              numberOfLines={3}
            />

            <View style={styles.imagePickerContainer}>
              <Text style={styles.label}>Restaurant Image (Optional)</Text>
              
              <View style={styles.imagePreviewArea}>
                {previewUri ? (
                  <Image source={{ uri: previewUri }} style={styles.imagePreview} resizeMode="cover" />
                ) : (
                  <>
                    <Ionicons name="image-outline" size={48} color={theme.textSecondary} />
                    <Text style={styles.placeholderText}>No image selected</Text>
                  </>
                )}
              </View>

              <View style={styles.imageActionButtons}>
                <TouchableOpacity 
                  style={styles.imageBtn} 
                  onPress={() => pickImage(false)}
                  disabled={submitting}
                >
                  <Ionicons name="images-outline" size={20} color={theme.text} />
                  <Text style={styles.imageBtnText}>Gallery</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.imageBtn} 
                  onPress={() => pickImage(true)}
                  disabled={submitting}
                >
                  <Ionicons name="camera-outline" size={20} color={theme.text} />
                  <Text style={styles.imageBtnText}>Camera</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.rowSpaceBetween}>
              <View style={styles.halfInputContainerLeft}>
                <Text style={styles.label}>Latitude</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 32.08"
                  placeholderTextColor={theme.textSecondary}
                  value={lat}
                  onChangeText={setLat}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfInputContainerRight}>
                <Text style={styles.label}>Longitude</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 34.78"
                  placeholderTextColor={theme.textSecondary}
                  value={lng}
                  onChangeText={setLng}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => {
                onClose();
                setFormError(null);
              }}
              disabled={submitting}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]} 
              onPress={handleEditRestaurant}
              disabled={submitting || availableCategories.length === 0}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.submitButtonText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

