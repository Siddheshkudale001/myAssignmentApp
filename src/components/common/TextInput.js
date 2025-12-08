
import { TextInput as RNTextInput, StyleSheet, Text, View } from 'react-native';

export default function TextInput({ label, error, style, ...props }) {
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <RNTextInput
        style={[styles.input, error && styles.errorBorder, style]}
        placeholder={label}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginVertical: 10,
  },
  label: {
    marginBottom: 6,
    fontWeight: '600',
    fontSize: 14,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#222',
    backgroundColor: '#FAFAFA',
    width: '100%',
    // subtle shadow for depth
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  errorBorder: {
    borderColor: '#E53935',
  },
  error: {
    color: '#E53935',
    marginTop: 6,
    fontSize: 13,
  },
});
