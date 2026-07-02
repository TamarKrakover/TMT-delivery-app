import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../contexts/ThemeContext';
import createStyles from '../../styles/AddCategoryModal.styles';
import { uploadService, categoryService } from '../../services/api';

export default function AddCategoryModal({ visible, onClose, onSuccess }) {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const [categoryName, setCategoryName] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setCategoryName('');
    setImageUri(null);
    setError('');
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
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
          aspect: [1, 1],
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
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
        setError('');
      }
    } catch (err) {
      setError('Failed to select image.');
    }
  };

  const handleSave = async () => {
    if (!categoryName.trim()) {
      setError('Category name is required.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      let uploadedUrl = '/api/uploads/categories/all.webp'; // Default fallback
      
      if (imageUri) {
        // Upload the image first
        const uploadResponse = await uploadService.uploadImage(imageUri);
        if (uploadResponse && uploadResponse.url) {
          uploadedUrl = uploadResponse.url;
        }
      }

      // Create the category
      const newCategory = await categoryService.create({
        name: categoryName.trim(),
        image: uploadedUrl
      });

      // Notify parent to update list
      if (onSuccess) {
        onSuccess(newCategory);
      }
      
      handleClose();
      Alert.alert('Success', 'Category added successfully!');
    } catch (err) {
      setError(err.message || 'Failed to create category.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          
          <View style={styles.header}>
            <Text style={styles.title}>Add New Category</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton} disabled={loading}>
              <Ionicons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Text style={styles.inputLabel}>Category Name</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. Italian, Sushi, Burgers"
            placeholderTextColor={theme.textSecondary}
            value={categoryName}
            onChangeText={setCategoryName}
            editable={!loading}
          />

          <View style={styles.imagePickerContainer}>
            <Text style={styles.inputLabel}>Category Image (Optional)</Text>
            
            <View style={styles.imagePreviewArea}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.imagePreview} resizeMode="cover" />
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
                disabled={loading}
              >
                <Ionicons name="images-outline" size={20} color={theme.text} />
                <Text style={styles.imageBtnText}>Gallery</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.imageBtn} 
                onPress={() => pickImage(true)}
                disabled={loading}
              >
                <Ionicons name="camera-outline" size={20} color={theme.text} />
                <Text style={styles.imageBtnText}>Camera</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.submitButtonText}>Save Category</Text>
            )}
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}
