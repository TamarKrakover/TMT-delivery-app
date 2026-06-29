import { StyleSheet, Dimensions } from 'react-native';
import { SIZES, FONTS, COLORS } from '../theme/theme';

const { width, height } = Dimensions.get('window');

const createStyles = (theme) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    backgroundColor: theme.surface,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    maxHeight: height * 0.8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    ...FONTS.h2,
    color: theme.text,
  },
  closeButton: {
    padding: 4,
  },
  inputLabel: {
    ...FONTS.body2,
    color: theme.textSecondary,
    marginBottom: 8,
    marginTop: 12,
  },
  textInput: {
    ...FONTS.body2,
    color: theme.text,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.background,
  },
  imagePickerContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  imagePreviewArea: {
    width: '100%',
    height: 150,
    borderRadius: 12,
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
    ...FONTS.body3,
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
    ...FONTS.body3,
    color: theme.text,
    marginLeft: 6,
  },
  submitButton: {
    backgroundColor: COLORS.primary || '#00c2e8',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    ...FONTS.h3,
    color: '#ffffff',
  },
  errorText: {
    ...FONTS.body3,
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  }
});

export default createStyles;
