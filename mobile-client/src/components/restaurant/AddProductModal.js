import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, Modal, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../theme/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { productService, uploadService, BASE_URL } from '../../services/api';
import { createStyles } from '../../styles/AddProductModal.styles';
import * as ImagePicker from 'expo-image-picker';

export default function AddProductModal({ visible, onClose, restaurant, onProductAdded }) {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  // Form states
  const [pName, setPName] = useState('');
  const [pPrice, setPPrice] = useState('');
  const [pDescription, setPDescription] = useState('');
  const [pImage, setPImage] = useState('');
  const [pSubmitting, setPSubmitting] = useState(false);
  const [pFormError, setPFormError] = useState(null);

  useEffect(() => {
    if (visible) {
      setPName('');
      setPPrice('');
      setPDescription('');
      setPImage('');
      setPFormError(null);
    }
  }, [visible]);

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
        setPImage(result.assets[0].uri);
        setPFormError(null);
      }
    } catch (err) {
      setPFormError('Failed to select image.');
    }
  };

  const handleAddProduct = async () => {
    if (!pName.trim()) {
      setPFormError('Product name is required.');
      return;
    }
    if (!pPrice.trim() || isNaN(parseFloat(pPrice))) {
      setPFormError('Product price must be a valid number.');
      return;
    }

    try {
      setPSubmitting(true);
      setPFormError(null);

      let finalImageUrl = '/api/uploads/products/default.webp';
      if (pImage && pImage.trim() !== '') {
        if (!pImage.startsWith('/api/') && !pImage.startsWith('http://') && !pImage.startsWith('https://')) {
          const uploadResponse = await uploadService.uploadImage(pImage);
          if (uploadResponse && uploadResponse.url) {
            finalImageUrl = uploadResponse.url;
          }
        } else {
          finalImageUrl = pImage.trim();
        }
      }

      const payload = {
        name: pName.trim(),
        price: parseFloat(pPrice),
        description: pDescription.trim(),
        image: finalImageUrl
      };

      const targetId = restaurant.id || restaurant._id;
      await productService.create(targetId, payload);

      if (onProductAdded) {
        onProductAdded();
      }
      onClose();
    } catch (err) {
      setPFormError(err.message || 'Failed to add product. Please try again.');
    } finally {
      setPSubmitting(false);
    }
  };

  const previewUri = pImage
    ? (pImage.startsWith('http') || pImage.startsWith('file://') || pImage.startsWith('content://') 
      ? pImage 
      : `${BASE_URL}${pImage}`)
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
          <Text style={styles.modalTitle}>Add Product to Menu</Text>
          
          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollMargin}>
            {pFormError && <Text style={styles.errorText}>{pFormError}</Text>}
            
            <Text style={styles.label}>Product Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter product name"
              placeholderTextColor={theme.textSecondary}
              value={pName}
              onChangeText={setPName}
            />

            <Text style={styles.label}>Price * (₪)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 45"
              placeholderTextColor={theme.textSecondary}
              value={pPrice}
              onChangeText={setPPrice}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter description"
              placeholderTextColor={theme.textSecondary}
              value={pDescription}
              onChangeText={setPDescription}
              multiline={true}
              numberOfLines={3}
            />

            <View style={styles.imagePickerContainer}>
              <Text style={styles.label}>Product Image (Optional)</Text>
              
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
                  disabled={pSubmitting}
                >
                  <Ionicons name="images-outline" size={20} color={theme.text} />
                  <Text style={styles.imageBtnText}>Gallery</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.imageBtn} 
                  onPress={() => pickImage(true)}
                  disabled={pSubmitting}
                >
                  <Ionicons name="camera-outline" size={20} color={theme.text} />
                  <Text style={styles.imageBtnText}>Camera</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => {
                onClose();
                setPFormError(null);
              }}
              disabled={pSubmitting}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.submitButton, pSubmitting && styles.submitButtonDisabled]} 
              onPress={handleAddProduct}
              disabled={pSubmitting}
            >
              {pSubmitting ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.submitButtonText}>Add Item</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

