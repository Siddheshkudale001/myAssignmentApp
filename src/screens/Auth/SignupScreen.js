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
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, globalStyles, layout, shadows, spacing, typography } from '../../utils';

// ✅ Correct Firebase import (matches your new structure)
import { signUpWithEmail } from '../../core/firebase/auth';

import { saveUserSession } from '../../services/session';
import { showToast } from '../../utils/toast';

// -------------------- Validators --------------------
const isEmail = (v) => /\S+@\S+\.\S+/.test(v);
const isStrongPassword = (v) => v && v.length >= 6;
const isFullName = (v) => v && v.trim().split(/\s+/).length >= 2;
const isMobileNumber = (v) => /^[0-9]{10}$/.test(v);

export default function SignupScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile]     = useState('');

  const [errors, setErrors]         = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError]   = useState(null);

  // -------------------- Validation --------------------
  const validate = () => {
    const errs = {};

    if (!isFullName(fullName)) errs.fullName = 'Please enter your first & last name';
    if (!isEmail(email)) errs.email = 'Please enter a valid email';
    if (!isStrongPassword(password)) errs.password = 'Password must be at least 6 characters';
    if (!isMobileNumber(mobile)) errs.mobile = 'Enter a 10-digit mobile number';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // -------------------- Error Mapping --------------------
  const friendlyError = (code, message) => {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered.';
      case 'auth/invalid-email':
        return 'Invalid email format.';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters.';
      case 'auth/network-request-failed':
        return 'Network error. Check your Internet.';
      default:
        return message || 'Sign up failed. Try again.';
    }
  };

  // -------------------- Submit --------------------

  const onSubmit = async () => {
    console.log("Submitting signup form...");
  if (submitting) return;

  setFormError(null);
  if (!validate()) return;

  try {
    setSubmitting(true);
    showToast(`User ${fullName} has been created successfully!`);
    // ✅ FIX — pass an OBJECT, not separate params
    const appUser = await signUpWithEmail({
      name: fullName.trim(),
      email: email.trim().toLowerCase(),
      password,
      phone: mobile,
    });
    showToast(`User ${fullName} has been created successfully!`);
    // await saveUserSession(appUser);

    // Alert.alert('Account created', 'You can now log in.', [
    //   { text: 'OK', onPress: () => navigation.navigate('Login') },
    // ]);

  } catch (e) {
    console.log("Firebase signup error:", e.code, e.message);

    const msg = friendlyError(e?.code, e?.message);
    setFormError(msg);
    Alert.alert('Sign Up Error', msg);

  } finally {
    setSubmitting(false);
  }
};


  // -------------------- UI --------------------
  return (
    <SafeAreaView style={{ flex: 1 , backgroundColor: colors.background }} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={typography.title}>Create your account</Text>
              <Text style={[typography.subtitle, styles.subtitle]}>
                It only takes a minute
              </Text>
            </View>

            <View style={[globalStyles.card, shadows.card]}>
              {/* Full Name */}
              <View style={globalStyles.field}>
                <TextInput
                  label="Full Name"
                  value={fullName}
                  onChangeText={(t) => {
                    setFullName(t);
                    if (errors.fullName) setErrors((s) => ({ ...s, fullName: undefined }));
                  }}
                  error={errors.fullName}
                />
              </View>

              {/* Email */}
              <View style={globalStyles.field}>
                <TextInput
                  label="Email"
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t);
                    if (errors.email) setErrors((s) => ({ ...s, email: undefined }));
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
                    if (errors.password) setErrors((s) => ({ ...s, password: undefined }));
                  }}
                  secureTextEntry
                  error={errors.password}
                />
              </View>

              {/* Mobile */}
              <View style={globalStyles.field}>
                <TextInput
                  label="Mobile Number"
                  value={mobile}
                  onChangeText={(t) => {
                    const digits = t.replace(/[^\d]/g, '');
                    setMobile(digits);
                    if (errors.mobile) setErrors((s) => ({ ...s, mobile: undefined }));
                  }}
                  keyboardType="phone-pad"
                  maxLength={10}
                  error={errors.mobile}
                />
              </View>

              {formError ? (
                <Text style={[typography.error, globalStyles.errorText]}>
                  {formError}
                </Text>
              ) : null}

              <Button
                title={submitting ? 'Creating account...' : 'Sign Up'}
                onPress={onSubmit}
                style={styles.button}
                disabled={submitting}
              />
            </View>

            <TouchableOpacity
              style={styles.footer}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={typography.caption}>
                Already have an account? <Text style={typography.link}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// -------------------- Styles --------------------
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
});
