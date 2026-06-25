import { StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS } from '../theme/theme';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: SIZES.lg,
    paddingBottom: 50,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: SIZES.lg,
  },
  logoImage: {
    width: 120,
    height: 60,
    marginBottom: SIZES.xs,
  },
  titleText: {
    ...FONTS.h1,
    color: '#1f2937',
    fontWeight: 'bold',
  },
  subtitleText: {
    ...FONTS.body2,
    color: '#4b5563',
    marginTop: SIZES.xs,
    textAlign: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  avatarPreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
  },
  avatarPlaceholderText: {
    color: '#6b7280',
    fontSize: 14,
  },
  imageButtonsRow: {
    flexDirection: 'row',
    marginTop: SIZES.sm,
    gap: SIZES.sm,
  },
  imageButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  imageButtonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  imageButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  imageButtonOutlineText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  imageErrorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: SIZES.xs,
  },
  formContainer: {
    marginBottom: SIZES.xl,
  },
  locationRow: {
    flexDirection: 'row',
    gap: SIZES.md,
    marginBottom: SIZES.md,
  },
  locationCol: {
    flex: 1,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  footerText: {
    ...FONTS.body2,
    color: '#4b5563',
  },
  footerLink: {
    ...FONTS.body2,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});

