import { StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS, lightTheme } from '../theme/theme';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: lightTheme.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 90,
    height: 40,
    resizeMode: 'contain',
  },
  profileButton: {
    padding: SIZES.xs,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  profilePic: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  content: {
    flex: 1,
    padding: SIZES.md,
  },
  welcomeText: {
    ...FONTS.h2,
    color: lightTheme.text,
  },
  subtitle: {
    ...FONTS.body1,
    color: lightTheme.textSecondary,
    marginTop: SIZES.sm,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: lightTheme.text,
    paddingHorizontal: SIZES.md,
    marginBottom: SIZES.sm,
  }
});
