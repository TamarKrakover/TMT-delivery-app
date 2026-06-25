import { StyleSheet } from 'react-native';
import { lightTheme, SIZES, FONTS, COLORS } from '../theme/theme';

export default StyleSheet.create({
  container: {
    marginVertical: SIZES.md,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: lightTheme.text,
    paddingHorizontal: SIZES.md,
    marginBottom: SIZES.sm,
  },
  scrollContent: {
    paddingHorizontal: SIZES.sm,
  },
  cardContainer: {
    width: 140,
    backgroundColor: lightTheme.surface,
    borderRadius: SIZES.radius,
    marginHorizontal: SIZES.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: lightTheme.borderLight,
    marginBottom: SIZES.sm,
  },
  imageWrapper: {
    width: '100%',
    height: 100,
    backgroundColor: lightTheme.border,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: SIZES.xs + 2,
  },
  nameText: {
    ...FONTS.body2,
    fontWeight: 'bold',
    color: lightTheme.text,
    marginBottom: 2,
  },
  priceText: {
    ...FONTS.caption,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  restaurantText: {
    ...FONTS.caption,
    color: lightTheme.textSecondary,
    fontSize: 10,
    marginTop: 2,
  }
});
