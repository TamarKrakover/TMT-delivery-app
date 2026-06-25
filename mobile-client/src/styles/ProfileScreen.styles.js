import { StyleSheet } from 'react-native';
import { COLORS, lightTheme, SIZES, FONTS } from '../theme/theme';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: lightTheme.background,
  },
  content: {
    flex: 1,
    padding: SIZES.md,
    alignItems: 'center',
  },
  title: {
    ...FONTS.h2,
    color: lightTheme.text,
    marginBottom: SIZES.lg,
    marginTop: SIZES.lg,
  },
  infoCard: {
    width: '100%',
    padding: SIZES.md,
    backgroundColor: lightTheme.surface,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: lightTheme.border,
    marginBottom: SIZES.lg,
  },
  label: {
    ...FONTS.body1,
    color: lightTheme.text,
    marginBottom: SIZES.sm,
  },
  buttonSecondary: {
    width: '100%',
    height: 50,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  buttonSecondaryText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    width: '100%',
    height: 50,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.danger,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: SIZES.lg,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
