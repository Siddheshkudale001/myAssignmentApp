// src/screens/Auth/LoginScreen.js
import { useState } from 'react';
import {
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
import { colors, globalStyles, layout, shadows, spacing } from '../../utils';
import { isEmail } from '../../utils/validators';

import { signInWithEmail } from '../../core/firebase/auth';   // ✅ FIXED IMPORT
import { saveUserSession } from '../../services/session';

import { SafeAreaView } from 'react-native-safe-area-context';

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
        return 'We couldn’t find an account with this email.';
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Incorrect email or password.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Check your internet.';
      default:
        return 'Something went wrong. Try again.';
    }
  };

  const onSubmit = async () => {
    if (submitting) return;
    setFormError(null);

    if (!validate()) return;

    try {
      setSubmitting(true);

      const appUser = await signInWithEmail(
        email.trim().toLowerCase(),
        password
      );

      await saveUserSession(appUser);

      onLoggedIn?.();

    } catch (e) {
      console.log('Login error:', e?.code, e?.message);
      setFormError(friendlyError(e?.code));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 , backgroundColor: colors.background }} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Welcome back</Text>
              <Text style={styles.subtitle}>Sign in to continue</Text>
            </View>

            <View style={[globalStyles.card, shadows.card]}>

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
              {formError ? (
                <Text style={styles.errorText}>{formError}</Text>
              ) : null}

              <Button
                title={submitting ? 'Signing in...' : 'Login'}
                onPress={onSubmit}
                style={styles.button}
                disabled={submitting}
              />
            </View>

            <TouchableOpacity style={styles.footer} onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.footerText}>
                Don't have an account? <Text style={styles.footerLink}>Sign up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* -------------------- STYLES -------------------- */
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
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { marginTop: spacing.sm, opacity: 0.6 },
  button: { marginTop: spacing.md },
  footer: { marginTop: spacing.xl, alignItems: 'center' },
  footerText: { fontSize: 14 },
  footerLink: { color: colors.primary, fontWeight: '600' },
  errorText: { color: 'red', marginTop: 8 },
});
