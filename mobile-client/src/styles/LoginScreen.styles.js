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
    flex: 1,
    padding: SIZES.lg,
    paddingBottom: 40,
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 60,
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
    flex: 1,
    justifyContent: 'center',
    marginVertical: SIZES.xl,
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

