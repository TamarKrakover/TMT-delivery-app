import React from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
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
  scrollMargin: {
    marginBottom: 16,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  }
});

export default function AddProductModalView({
  visible,
  onClose,
  pFormError,
  setPFormError,
  pName,
  setPName,
  pPrice,
  setPPrice,
  pDescription,
  setPDescription,
  pImage,
  setPImage,
  pSubmitting,
  handleAddProduct
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

            <Text style={styles.label}>Image URL / Path</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. /api/uploads/products/custom.webp"
              placeholderTextColor={theme.textSecondary}
              value={pImage}
              onChangeText={setPImage}
              autoCapitalize="none"
            />
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
