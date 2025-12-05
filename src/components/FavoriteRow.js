
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../utils';
import { formatINR } from '../utils/format';
import { stars } from '../utils/rating';

const THUMB = 64;

export default function FavoriteRow({ item, onPress, onLongPress, onRemove }) {
  return (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={0.9}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      {/* Thumbnail */}
      <View style={styles.thumbWrap}>
        <Image source={{ uri: item.image }} style={styles.thumb} resizeMode="contain" />
      </View>

      {/* Content */}
      <View style={styles.rowContent}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>

        <View style={styles.meta}>
          <Text style={styles.rating}>
            {stars(item.rating?.rate ?? 0)}{' '}
            <Text style={styles.ratingCount}>({item.rating?.count ?? 0})</Text>
          </Text>
          <Text style={styles.price}>{formatINR(item.price)}</Text>
        </View>

        {/* Remove button */}
        <TouchableOpacity style={styles.removeBtn} onPress={onRemove} activeOpacity={0.9}>
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md, // 8
  },
  thumbWrap: {
    width: THUMB,
    height: THUMB,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    overflow: 'hidden',
  },
  thumb: { width: '100%', height: '100%' },
  rowContent: { flex: 1 },
  title: { ...typography.body, fontWeight: '600', color: colors.text },
  meta: {
    marginTop: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rating: { fontSize: 14, color: colors.text },
  ratingCount: { fontSize: 13, color: colors.textMuted },
  price: { fontSize: 16, fontWeight: '700', color: colors.text },
  removeBtn: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,  // 12
    paddingVertical: spacing.sm,    // 6
    borderRadius: radius.md,        // 10
    backgroundColor: colors.error,
  },
  removeText: { color: colors.card, fontWeight: '700', fontSize: 13 },
});
