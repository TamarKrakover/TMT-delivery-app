import { StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS } from '../theme/theme';

export default (theme) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  content: {
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: SIZES.lg,
    backgroundColor: theme.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: SIZES.sm,
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  profileName: {
    ...FONTS.h2,
    color: theme.text,
  },
  profileUsername: {
    ...FONTS.caption,
    color: theme.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: theme.text,
    marginHorizontal: SIZES.md,
    marginTop: SIZES.lg,
    marginBottom: SIZES.sm,
  },
  listContent: {
    paddingBottom: SIZES.xl,
  },
  orderCard: {
    backgroundColor: theme.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.md,
    marginHorizontal: SIZES.md,
    marginVertical: SIZES.xs,
    borderWidth: 1,
    borderColor: theme.border,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  orderRestaurantName: {
    ...FONTS.body1,
    color: theme.text,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: SIZES.radius / 2,
  },
  statusBadgeProcessing: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  statusBadgeDone: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  statusText: {
    ...FONTS.caption,
    fontWeight: 'bold',
  },
  orderDate: {
    ...FONTS.caption,
    color: theme.textSecondary,
    marginBottom: SIZES.sm,
  },
  divider: {
    height: 1,
    backgroundColor: theme.border,
    marginVertical: SIZES.xs,
  },
  orderItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  orderItemName: {
    ...FONTS.body2,
    color: theme.text,
    flex: 1,
  },
  orderItemPrice: {
    ...FONTS.body2,
    color: theme.textSecondary,
  },
  orderTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.sm,
    paddingTop: SIZES.xs,
    borderTopWidth: 1,
    borderTopColor: theme.borderLight,
  },
  orderTotalLabel: {
    ...FONTS.body2,
    color: theme.text,
    fontWeight: 'bold',
  },
  orderTotalValue: {
    ...FONTS.body2,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.xl * 2,
  },
  emptyText: {
    ...FONTS.body1,
    color: theme.textSecondary,
    marginTop: SIZES.sm,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.danger,
    marginHorizontal: SIZES.md,
    marginVertical: SIZES.md,
    paddingVertical: 14,
    borderRadius: SIZES.radius,
  },
  logoutButtonText: {
    ...FONTS.body1,
    color: '#ffffff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  loadingContainer: {
    paddingVertical: SIZES.xl,
    alignItems: 'center',
  },
});
