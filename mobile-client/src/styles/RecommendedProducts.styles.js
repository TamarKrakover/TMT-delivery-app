import { StyleSheet } from 'react-native';
import { SIZES, FONTS, COLORS } from '../theme/theme';

export default (theme) => StyleSheet.create({
  container: {
    marginVertical: SIZES.md,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: theme.text,
    paddingHorizontal: SIZES.md,
    marginBottom: SIZES.sm,
  },
  scrollContent: {
    paddingHorizontal: SIZES.sm,
  },
  cardContainer: {
    width: 140,
    backgroundColor: theme.surface,
    borderRadius: SIZES.radius,
    marginHorizontal: SIZES.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.borderLight,
    marginBottom: SIZES.sm,
  },
  imageWrapper: {
    width: '100%',
    height: 100,
    backgroundColor: theme.border,
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
    color: theme.text,
    marginBottom: 2,
  },
  priceText: {
    ...FONTS.caption,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  restaurantText: {
    ...FONTS.caption,
    color: theme.textSecondary,
    fontSize: 10,
    marginTop: 2,
  },
  emptyText: {
    ...FONTS.body2,
    color: theme.textSecondary,
    paddingHorizontal: SIZES.md,
    fontStyle: 'italic',
  }
});
