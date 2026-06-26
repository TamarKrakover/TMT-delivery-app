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
    width: 100,
    height: 135,
    backgroundColor: theme.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    marginHorizontal: SIZES.sm,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryItemSelected: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  imageContainer: {
    width: '100%',
    height: 85,
    backgroundColor: theme.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 6,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  categoryName: {
    ...FONTS.body2,
    fontSize: 13,
    color: theme.text,
    fontWeight: 'bold',
  },
  categoryNameSelected: {
    color: COLORS.primary,
  },
  categoryPlaces: {
    fontSize: 10,
    color: theme.textSecondary,
    marginTop: 1,
  }
});
