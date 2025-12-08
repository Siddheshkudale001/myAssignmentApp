
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';

export default function Button({ title, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.button}
    >
      <Text style={styles.label}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: '#1976D2', // primary
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    // A little breathing room if placed inline
    marginVertical: 6,
    // Width feel without forcing full width
    minWidth: 160,
    alignSelf: 'center',

    // Border to improve contrast on light backgrounds
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',

    // Shadow/Elevation
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOpacity: 0.18,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
        }
      : {
          elevation: 3,
        }),
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.4,
    // Slight caps look without shouting
    textTransform: 'uppercase',
  },
});
