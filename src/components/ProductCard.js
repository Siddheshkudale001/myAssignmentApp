
import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, radius, shadows, typography } from '../utils';

export default function ProductCard({ image, title, price, onPress }) {
  return (
    <TouchableOpacity style={[styles.card, shadows.card]} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: image }} style={styles.image} resizeMode="contain" />
      </View>
      <Text style={styles.cardTitle} numberOfLines={2}>{title}</Text>
      <Text style={styles.cardPrice}>{price}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 220,
    height: 220,
    marginRight: spacing.lg,        // 12
    backgroundColor: colors.card,
    borderRadius: radius.lg,        // 14
    padding: spacing.md,            // 12
  },
  imageWrap: {
    height: 120,
    borderRadius: radius.md,        // 10-ish; if you want exact, set md:10
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,       // 12 → you used 10; keeping 12 for harmony
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  cardTitle: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.sm,       // 6
  },
  cardPrice: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '700',
  },
})