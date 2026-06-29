import { StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS } from '../theme/theme';

export default StyleSheet.create({
  container: {
    marginBottom: SIZES.md,
  },
  label: {
    ...FONTS.h3,
    color: '#1f2937',
    marginBottom: SIZES.xs,
    textAlign: 'left',
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: SIZES.radius,
    padding: SIZES.md,
    fontSize: 16,
    color: '#1f2937',
    textAlign: 'left',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: COLORS.danger,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    textAlign: 'left',
    marginTop: SIZES.xs,
  },
});
