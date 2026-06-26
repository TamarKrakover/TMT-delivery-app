import { StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS } from '../theme/theme';

export default (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
  },
  loadingText: {
    ...FONTS.body1,
    marginTop: SIZES.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
    padding: SIZES.lg,
  },
  errorText: {
    ...FONTS.h3,
    color: theme.textSecondary,
    textAlign: 'center',
    marginTop: SIZES.md,
    marginBottom: SIZES.lg,
  },
  errorBackButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radius,
  },
  errorBackButtonText: {
    ...FONTS.body1,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  heroImage: {
    width: '100%',
    height: 200,
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'space-between',
    padding: SIZES.md,
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SIZES.xs,
    marginTop: SIZES.xs,
  },
  detailsCard: {
    backgroundColor: theme.surface,
    borderTopLeftRadius: SIZES.radius * 1.5,
    borderTopRightRadius: SIZES.radius * 1.5,
    marginTop: -SIZES.radius * 1.5,
    padding: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  restaurantName: {
    ...FONTS.h1,
    color: theme.text,
    marginBottom: SIZES.xs,
  },
  categoryBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radius / 2,
    alignSelf: 'flex-start',
    marginBottom: SIZES.sm,
  },
  categoryBadgeText: {
    ...FONTS.caption,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  restaurantDesc: {
    ...FONTS.body1,
    color: theme.textSecondary,
    lineHeight: 22,
  },
  menuTitle: {
    ...FONTS.h3,
    color: theme.text,
    marginHorizontal: SIZES.md,
    marginTop: SIZES.lg,
    marginBottom: SIZES.sm,
  },
  listContent: {
    paddingBottom: SIZES.xl,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: theme.surface,
    marginHorizontal: SIZES.md,
    marginVertical: SIZES.xs,
    padding: SIZES.md,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: theme.border,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
    marginRight: SIZES.md,
  },
  productName: {
    ...FONTS.h3,
    color: theme.text,
    marginBottom: SIZES.xs,
  },
  productPrice: {
    ...FONTS.body1,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginBottom: SIZES.xs,
  },
  productDesc: {
    ...FONTS.caption,
    color: theme.textSecondary,
    lineHeight: 16,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: SIZES.radius,
  },
  emptyMenuContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.xl * 2,
  },
  emptyMenuText: {
    ...FONTS.body1,
    color: theme.textSecondary,
    marginTop: SIZES.sm,
    textAlign: 'center',
  },
});
