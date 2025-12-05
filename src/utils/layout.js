
import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const layout = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  row: { flexDirection: 'row', alignItems: 'center' },
  col: { flexDirection: 'column' },
  center: { justifyContent: 'center', alignItems: 'center' },
  between: { justifyContent: 'space-between', alignItems: 'center' },
});
