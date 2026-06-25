import { StyleSheet } from 'react-native';
import { SIZES, FONTS } from '../theme/theme';

export default (theme) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    padding: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    backgroundColor: theme.surface,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.background,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.sm,
    height: 50,
    borderWidth: 1,
    borderColor: theme.border,
  },
  searchIcon: {
    marginRight: SIZES.sm,
  },
  searchInput: {
    flex: 1,
    ...FONTS.body1,
    color: theme.text,
    height: '100%',
  },
  clearButton: {
    padding: SIZES.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.md,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...FONTS.body1,
    color: theme.textSecondary,
    marginTop: SIZES.md,
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    backgroundColor: theme.surface,
  },
  tabButton: {
    flex: 1,
    paddingVertical: SIZES.sm,
    alignItems: 'center',
    borderRadius: SIZES.radius,
    marginHorizontal: SIZES.xs,
    backgroundColor: theme.background,
    borderWidth: 1,
    borderColor: theme.border,
  },
  activeTabButton: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  tabText: {
    ...FONTS.body2,
    color: theme.textSecondary,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: theme.surface,
  }
});
