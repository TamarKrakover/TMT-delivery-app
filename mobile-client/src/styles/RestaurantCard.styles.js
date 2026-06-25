import { StyleSheet } from 'react-native';
import { SIZES, FONTS, COLORS } from '../theme/theme';

export default (theme) => StyleSheet.create({
  cardContainer: {
    backgroundColor: theme.surface,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  imageWrapper: {
    width: '100%',
    height: 150,
    backgroundColor: theme.border,
    position: 'relative',
  },
  restaurantImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryBadge: {
    position: 'absolute',
    top: SIZES.sm,
    right: SIZES.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: SIZES.sm,
    paddingVertical: 4,
    borderRadius: SIZES.radius,
  },
  categoryBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: SIZES.md,
  },
  nameText: {
    ...FONTS.h3,
    color: theme.text,
    marginBottom: 4,
  },
  descriptionText: {
    ...FONTS.body2,
    color: theme.textSecondary,
    marginBottom: SIZES.sm,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  distanceText: {
    ...FONTS.caption,
    color: COLORS.primary,
    fontWeight: 'bold',
  }
});
