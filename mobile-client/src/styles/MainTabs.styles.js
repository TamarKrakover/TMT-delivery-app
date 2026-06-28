import { StyleSheet } from 'react-native';
import { COLORS } from '../theme/theme';

export default (theme) => StyleSheet.create({
  tabBar: {
    backgroundColor: theme.navbarBg || '#ffffff',
    borderTopColor: theme.border || '#e5e7eb',
    paddingBottom: 4,
  },
  tabBarBadge: {
    backgroundColor: COLORS.primary,
  },
});
