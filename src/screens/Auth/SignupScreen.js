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
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '../../components/common/Button';
import TextInput from '../../components/common/TextInput';
import {
  colors,
  globalStyles,
  layout,
  shadows,
  spacing,
  typography,
} from '../../utils';

import { signUpWithEmail } from '../../core/firebase/auth';
import { showToast } from '../../utils/toast';

// -------------------- Validators --------------------
const isEmail = (v) => /\S+@\S+\.\S+/.test(v);
const isStrongPassword = (v) => v && v.length >= 6;
const isFullName = (v) => v && v.trim().split(/\s+/).length >= 2;
const isMobileNumber = (v) => /^[0-9]{10}$/.test(v);

export default function SignupScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

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

  const onSubmit = async () => {
    if (submitting) return;
    setFormError(null);
    if (!validate()) return;

    try {
      setSubmitting(true);
      showToast(`User ${fullName} has been created successfully!`);
      await signUpWithEmail({
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: mobile,
      });
    } catch (e) {
      const msg = friendlyError(e?.code, e?.message);
      setFormError(msg);
      Alert.alert('Sign Up Error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  // -------------------- UI --------------------
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingVertical: isLandscape ? spacing.lg : spacing['2xl'] },
          ]}
        >
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={typography.title}>Create your account</Text>
              <Text style={[typography.subtitle, styles.subtitle]}>
                It only takes a minute
              </Text>
            </View>

            {/* Card */}
            <View style={[globalStyles.card, shadows.card]}>
              <View style={globalStyles.field}>
                <TextInput
                  label="Full Name"
                  value={fullName}
                  onChangeText={(t) => {
                    setFullName(t);
                    if (errors.fullName)
                      setErrors((s) => ({ ...s, fullName: undefined }));
                  }}
                  error={errors.fullName}
                />
              </View>

              <View style={globalStyles.field}>
                <TextInput
                  label="Email"
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t);
                    if (errors.email)
                      setErrors((s) => ({ ...s, email: undefined }));
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
                    if (errors.password)
                      setErrors((s) => ({ ...s, password: undefined }));
                  }}
                  secureTextEntry
                  error={errors.password}
                />
              </View>

              <View style={globalStyles.field}>
                <TextInput
                  label="Mobile Number"
                  value={mobile}
                  onChangeText={(t) => {
                    const digits = t.replace(/[^\d]/g, '');
                    setMobile(digits);
                    if (errors.mobile)
                      setErrors((s) => ({ ...s, mobile: undefined }));
                  }}
                  keyboardType="phone-pad"
                  maxLength={10}
                  error={errors.mobile}
                />
              </View>

              {formError && (
                <Text style={[typography.error, globalStyles.errorText]}>
                  {formError}
                </Text>
              )}

              <Button
                title={submitting ? 'Creating account...' : 'Sign Up'}
                onPress={onSubmit}
                disabled={submitting}
                style={styles.button}
              />
            </View>

            {/* Footer */}
            <TouchableOpacity
              style={styles.footer}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={typography.caption}>
                Already have an account?{' '}
                <Text style={typography.link}>Login</Text>
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
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: { flex: 1 },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  container: {
    ...layout.screen,
    paddingHorizontal: spacing['2xl'],
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
});
