
// src/screens/Auth/LoginScreen.js
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Button from '../../components/common/Button';
import TextInput from '../../components/common/TextInput';
import { colors, globalStyles, layout, shadows, spacing, typography } from '../../utils';
import { isEmail } from '../../utils/validators';

import { signInWithEmail } from '../../services/auth';
import { saveUserSession } from '../../services/session';

const isNotEmpty = (v) => typeof v === 'string' && v.trim().length > 0;

export default function LoginScreen({ onLoggedIn, navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const validate = () => {
    const errs = {};
    if (!isEmail(email)) errs.email = 'Please enter a valid email address';
    if (!isNotEmpty(password)) errs.password = 'Please enter your password';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const friendlyError = (code) => {
    switch (code) {
      case 'auth/invalid-email':
      case 'auth/missing-email':
        return 'Please enter a valid email address.';
      case 'auth/user-not-found':
        return 'We couldn’t find an account with this email. Check for typos or create a new account.';
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Incorrect email or password. Please try again or reset your password.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please wait a minute and try again.';
      case 'auth/user-disabled':
        return 'Your account is currently unavailable. Please contact support for assistance.';
      case 'auth/network-request-failed':
        return 'We’re having trouble connecting. Please check your internet and try again.';
      default:
        return 'Something went wrong while signing you in. Please try again in a moment.';
    }
  };

  const onSubmit = async () => {
    if (submitting) return;
    setFormError(null);
    if (!validate()) return;

    try {
      setSubmitting(true);

      const appUser = await signInWithEmail({
        email: email.trim().toLowerCase(),
        password,
      });

      await saveUserSession(appUser);

      // ✅ Let RootNavigator swap stacks
      onLoggedIn?.();

      // ❌ Do NOT navigation.reset here; Home exists only in AppStack after onLoggedIn flips the state

    } catch (e) {
      console.log('Login error:', e?.code, e?.message);
      const msg = friendlyError(e?.code);
      setFormError(msg);
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
          <TouchableOpacity style={styles.footer} onPress={() => navigation.navigate('Signup')}>
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
  header: { marginBottom: spacing.xl },
  subtitle: { marginTop: spacing.sm },
  button: { marginTop: spacing.md },
  footer: { marginTop: spacing.xl, alignItems: 'center' },
  footerLink: { color: colors.primary, fontWeight: '600' },
});
