import { StyleSheet } from 'react-native';
import { SIZES, FONTS } from '../theme/theme';

export default (theme) => StyleSheet.create({
  listContent: {
    paddingBottom: SIZES.xl,
  },
  emptyListContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyListText: {
    ...FONTS.body1,
    color: theme.textSecondary,
    textAlign: 'center',
  }
});
