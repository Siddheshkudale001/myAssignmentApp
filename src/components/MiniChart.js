
import { StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '../utils';

// Minimal bar chart: no deps, no animation.
// Props: data:number[], height:number, barWidth:number, gap:number
export default function MiniChart({ data = [], height = 60, barWidth = 10, gap = 6 }) {
  if (!Array.isArray(data) || data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = Math.max(1, max - min);

  return (
    <View style={[styles.wrap, { height }]}>
      {data.map((v, i) => {
        const normalized = (v - min) / range;
        const barH = Math.max(6, Math.round(normalized * (height - 10)));
        return (
          <View
            key={`${i}-${v}`}
            style={[
              styles.bar,
              {
                width: barWidth,
                height: barH,
                marginRight: gap,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: spacing.sm, // 6
  },
  bar: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm, // 8
    alignSelf: 'flex-end',
  },
});
