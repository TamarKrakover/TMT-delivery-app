import React from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../theme/theme';
import { useTheme } from '../contexts/ThemeContext';

export const createStyles = (theme) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: theme.background,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    color: theme.text,
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'left',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textSecondary,
    marginBottom: 4,
    textAlign: 'left',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: theme.text,
    fontWeight: '600',
    fontSize: 16,
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: theme.background,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.border,
  },
  categoryChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    color: theme.text,
    fontSize: 12,
  },
  categoryChipTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
  scrollMargin: {
    marginBottom: 16,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInputContainerLeft: {
    flex: 1,
    marginRight: 8,
  },
  halfInputContainerRight: {
    flex: 1,
    marginLeft: 8,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  imagePickerContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  imagePreviewArea: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  placeholderText: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 8,
  },
  imageActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  imageBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: theme.background,
    borderWidth: 1,
    borderColor: theme.border,
    marginHorizontal: 4,
  },
  imageBtnText: {
    fontSize: 14,
    color: theme.text,
    marginLeft: 6,
  }
});

export default function EditRestaurantModalView({
  visible,
  onClose,
  formError,
  setFormError,
  name,
  setName,
  category,
  setCategory,
  availableCategories,
  description,
  setDescription,
  image,
  setImage,
  lat,
  setLat,
  lng,
  setLng,
  submitting,
  handleEditRestaurant,
  pickImage
}) {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

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
                {image ? (
                  <Image source={{ uri: image }} style={styles.imagePreview} resizeMode="cover" />
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
