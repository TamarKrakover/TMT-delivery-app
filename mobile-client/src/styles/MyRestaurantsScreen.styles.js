import { StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS } from '../theme/theme';

export const createStyles = (theme) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    backgroundColor: theme.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  backButton: {
    padding: SIZES.xs,
    marginRight: SIZES.sm,
  },
  headerTitle: {
    ...FONTS.h2,
    color: theme.text,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xl,
    marginTop: SIZES.xxl,
  },
  emptyTitle: {
    ...FONTS.h2,
    color: theme.text,
    marginTop: SIZES.md,
    marginBottom: SIZES.xs,
  },
  emptyText: {
    ...FONTS.body2,
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  listContent: {
    paddingBottom: 100,
  },
  headerRow: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    backgroundColor: theme.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  headerLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonPadding: {
    padding: 4,
  },
  emptyActionButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  emptyActionButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  }
});

