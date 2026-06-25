import { StyleSheet } from 'react-native';
import { lightTheme, SIZES, FONTS } from '../theme/theme';

export const commonStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: lightTheme.background,
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
    color: lightTheme.text,
  },
  subtitle: {
    ...FONTS.body1,
    color: lightTheme.textSecondary,
    marginTop: SIZES.sm,
  }
});
