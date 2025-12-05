
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Button from '../../components/common/Button';
import TextInput from '../../components/common/TextInput';
import { colors, globalStyles, layout, shadows, spacing, typography } from '../../utils';
import { isEmail, isStrongPassword } from '../../utils/validators';

export default function LoginScreen({onLoggedIn ,navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const validate = () => {
    const errs = {};
    if (!isEmail(email)) errs.email = 'Please enter a valid email address';
    if (!isStrongPassword(password)) errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  
const onSubmit = async () => {
  setFormError(null);
  if (!validate()) return;

  try {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));

    // Switch to AppStack by flipping the auth flag
    onLoggedIn?.();

    // Optional: If you want an Alert, show it AFTER switching, but avoid blocking UX.
    // Alert.alert('Success', 'Logged in successfully!');
  } catch (e) {
    setFormError(e?.message ?? 'Login failed. Please try again.');
  } finally {
    setSubmitting(false);
  }
};


  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={typography.title}>Welcome back</Text>
            <Text style={[typography.subtitle, styles.subtitle]}>Sign in to continue</Text>
          </View>

          {/* Card */}
          <View style={[globalStyles.card, shadows.card]}>
            {/* Email */}
            <View style={globalStyles.field}>
              <TextInput
                label="Email"
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                error={errors.email}
              />
            </View>

            {/* Password */}
            <View style={globalStyles.field}>
              <TextInput
                label="Password"
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                secureTextEntry
                error={errors.password}
              />
            </View>

            {/* Form-level error */}
            {formError ? <Text style={[typography.error, globalStyles.errorText]}>{formError}</Text> : null}

            {/* CTA */}
            <Button
              title={submitting ? 'Signing in...' : 'Login'}
              onPress={onSubmit}
              style={styles.button}
              disabled={submitting}
            />
          </View>

          {/* Footer */}
          <TouchableOpacity style={styles.footer} onPress={()=> navigation.navigate("Signup")} >
            <Text style={typography.caption}>
              Don't have account? <Text style={styles.footerLink}>Sign up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },

  container: {
    ...layout.screen,
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing['3xl'],
    paddingBottom: spacing['2xl'],
  },

  header: {
    marginBottom: spacing.xl,
  },

  subtitle: {
    marginTop: spacing.sm,
  },

  button: {
    marginTop: spacing.md,
  },

  footer: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },

  footerLink: {
    color: colors.primary,
    fontWeight: '600',
  },
})