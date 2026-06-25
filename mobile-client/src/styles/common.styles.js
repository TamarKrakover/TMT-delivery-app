import { StyleSheet } from 'react-native';
import { SIZES, FONTS } from '../theme/theme';

export const commonStyles = (theme) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  content: {
    flex: 1,
    padding: SIZES.md,
  },
  centeredContent: {
    flex: 1,
    padding: SIZES.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...FONTS.h2,
    color: theme.text,
  },
  subtitle: {
    ...FONTS.body1,
    color: theme.textSecondary,
    marginTop: SIZES.sm,
  }
});
