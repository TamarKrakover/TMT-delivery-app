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
  inner: {
    flexGrow: 1,
    padding: SIZES.lg,
    paddingBottom: 20,
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: SIZES.sm,
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
    ...FONTS.body1,
    color: '#4b5563',
    marginTop: SIZES.sm,
    textAlign: 'center',
  },
  formContainer: {
    marginVertical: SIZES.md,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
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

