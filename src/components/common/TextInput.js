
import { TextInput as RNTextInput, StyleSheet, Text, View } from 'react-native';

export default function TextInput({ label, error, style, ...props }) {
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <RNTextInput
        style={[styles.input, error && styles.errorBorder, style]}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginVertical: 8 },
  label: { marginBottom: 4, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 10,
    // make the input stretch within a column:
    width: '100%',
  },
  errorBorder: { borderColor: '#E53935' },
  error: { color: '#E53935', marginTop: 4 },
});
