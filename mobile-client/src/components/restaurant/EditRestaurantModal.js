import React, { useState, useEffect } from 'react';
import EditRestaurantModalView from '../../styles/EditRestaurantModal.styles';
import { restaurantService, categoryService, uploadService } from '../../services/api';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
export default function EditRestaurantModal({ visible, onClose, restaurant, onRestaurantUpdated }) {
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
      console.log("Failed to fetch categories:", e.message);
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
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
      console.error('Error picking image:', err);
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
      if (image && (image.startsWith('file://') || image.startsWith('content://'))) {
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
      console.log("Failed to update restaurant:", err.message);
      setFormError(err.message || 'Failed to update restaurant. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <EditRestaurantModalView
      visible={visible}
      onClose={onClose}
      formError={formError}
      setFormError={setFormError}
      name={name}
      setName={setName}
      category={category}
      setCategory={setCategory}
      availableCategories={availableCategories}
      description={description}
      setDescription={setDescription}
      image={image}
      setImage={setImage}
      lat={lat}
      setLat={setLat}
      lng={lng}
      setLng={setLng}
      submitting={submitting}
      handleEditRestaurant={handleEditRestaurant}
      pickImage={pickImage}
    />
  );
}
