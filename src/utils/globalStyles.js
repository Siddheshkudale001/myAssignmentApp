
import { StyleSheet } from 'react-native';
import { spacing } from './spacing';
import { colors } from './colors';
import { radius } from './radius';

export const globalStyles = StyleSheet.create({
  // paddings/margins most frequently used in your login screen
  px: { paddingHorizontal: spacing['2xl'] },
  pt: { paddingTop: spacing['3xl'] },
  pb: { paddingBottom: spacing['2xl'] },
  mbSm: { marginBottom: spacing.lg },
  mbMd: { marginBottom: spacing.xl },
  mtSm: { marginTop: spacing.sm },
  mtMd: { marginTop: spacing.md },
  mtLg: { marginTop: spacing.xl },
  mtXl: { marginTop: spacing['2xl'] },

  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 0, // you used shadow, not border for card
  },

  field: { marginBottom: spacing.lg },

  errorText: { color: colors.error, marginTop: spacing.sm, marginBottom: spacing.md },
  
  listContent: {
    paddingHorizontal: spacing.xl,  // 16
    paddingTop: spacing.md,         // 8 (your code uses 12; adjust if you want exact)
    paddingBottom: spacing['3xl'],  // 24
  },
  
  separator: {
    height: 10,
  },
  
chip: {
    paddingHorizontal: spacing.lg,  // 12
    paddingVertical: spacing.sm,    // 6
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },

chipActive: {
    borderColor: colors.primary,
    backgroundColor: '#E8F0FE',
  },
  chipText: {
    fontSize: 13,
    color: colors.text,
  },

 chipTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
    rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

});
