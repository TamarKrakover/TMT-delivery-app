import { StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS } from '../theme/theme';

export default (theme) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
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
    color: theme.text,
  },
  subtitle: {
    ...FONTS.body1,
    color: theme.textSecondary,
    marginTop: SIZES.sm,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: theme.text,
    paddingHorizontal: SIZES.md,
    marginBottom: SIZES.sm,
  },
  footerContainer: {
    paddingVertical: SIZES.xl,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: SIZES.xs,
  },
  footerTitle: {
    ...FONTS.h3,
    color: theme.textSecondary,
    fontWeight: 'bold',
    marginTop: SIZES.sm,
  },
  footerText: {
    ...FONTS.body2,
    color: theme.textSecondary,
    marginTop: 2,
  }
});
