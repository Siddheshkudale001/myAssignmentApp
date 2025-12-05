
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { globalStyles, spacing } from '../utils';

export default function CategoryChip({ label, active, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.chip, globalStyles.chip, active && globalStyles.chipActive]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Text style={[globalStyles.chipText, active && globalStyles.chipTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    marginRight: spacing.md, // gap between chips
  },
});
