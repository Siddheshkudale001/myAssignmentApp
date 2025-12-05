
import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const typography = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '700', color: colors.text, letterSpacing: 0.2 },
  subtitle: { fontSize: 14, color: colors.textMuted },
  body: { fontSize: 14, color: colors.text },
  caption: { fontSize: 13, color: colors.textMuted },
  error: { fontSize: 13, color: colors.error },
  link: { color: colors.primary, fontWeight: '600' },
 greet: { fontSize: 24, fontWeight: '700', color: colors.text },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  
  sectionDesc: { fontSize: 13, color: colors.textMuted },

});
