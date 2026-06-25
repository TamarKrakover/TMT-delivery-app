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
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: SIZES.sm,
  },
  imageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  imageContainerSelected: {
    borderColor: COLORS.primary,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryName: {
    ...FONTS.body2,
    color: theme.textSecondary,
    fontWeight: '500',
  },
  categoryNameSelected: {
    color: COLORS.primary,
    fontWeight: 'bold',
  }
});
