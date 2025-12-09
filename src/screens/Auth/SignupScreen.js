
// import { useState } from 'react';
// import {
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import Button from '../../components/common/Button';
// import TextInput from '../../components/common/TextInput';

// const isEmail = (v) => /\S+@\S+\.\S+/.test(v);
// const isStrongPassword = (v) => typeof v === 'string' && v.length >= 6;
// const isFullName = (v) => typeof v === 'string' && v.trim().split(/\s+/).length >= 2;
// const isMobileNumber = (v) => /^[0-9]{10}$/.test(v);

// import { globalStyles, layout, shadows, spacing, typography } from '../../utils';

// export default function SignupScreen({navigation}) {
//   const [fullName, setFullName] = useState('');
//   const [email,    setEmail]    = useState('');
//   const [password, setPassword] = useState('');
//   const [mobile,   setMobile]   = useState('');

//   const [errors, setErrors]         = useState({});
//   const [submitting, setSubmitting] = useState(false);
//   const [formError, setFormError]   = useState(null);

//   const validate = () => {
//     const errs = {};
//     if (!isFullName(fullName)) errs.fullName = 'Please enter your first & last name';
//     if (!isEmail(email))       errs.email    = 'Please enter a valid email address';
//     if (!isStrongPassword(password)) errs.password = 'Password must be at least 6 characters';
//     if (!isMobileNumber(mobile)) errs.mobile = 'Enter a 10-digit mobile number';
//     setErrors(errs);
//     return Object.keys(errs).length === 0;
//   };

//   const onSubmit = async () => {
//     setFormError(null);
//     if (!validate()) return;

//     try {
//       setSubmitting(true);
//       // 🔒 Replace this with your real signup API call
//       await new Promise((r) => setTimeout(r, 800));
//       Alert.alert('Account created', 'You can now log in.', [{ text: 'OK' }]);
//     } catch (e) {
//       setFormError(e?.message ?? 'Sign up failed. Please try again.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.flex}
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//     >
//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         keyboardShouldPersistTaps="handled"
//       >
//         <View style={styles.container}>
//           {/* Header */}
//           <View style={styles.header}>
//             <Text style={typography.title}>Create your account</Text>
//             <Text style={[typography.subtitle, styles.subtitle]}>It only takes a minute</Text>
//           </View>

//           {/* Card */}
//           <View style={[globalStyles.card, shadows.card]}>
//             {/* Full Name */}
//             <View style={globalStyles.field}>
//               <TextInput
//                 label="Full Name"
//                 value={fullName}
//                 onChangeText={(t) => {
//                   setFullName(t);
//                   if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
//                 }}
//                 error={errors.fullName}
//               />
//             </View>

//             {/* Email */}
//             <View style={globalStyles.field}>
//               <TextInput
//                 label="Email"
//                 value={email}
//                 onChangeText={(t) => {
//                   setEmail(t);
//                   if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
//                 }}
//                 autoCapitalize="none"
//                 keyboardType="email-address"
//                 error={errors.email}
//               />
//             </View>

//             {/* Password */}
//             <View style={globalStyles.field}>
//               <TextInput
//                 label="Password"
//                 value={password}
//                 onChangeText={(t) => {
//                   setPassword(t);
//                   if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
//                 }}
//                 secureTextEntry
//                 error={errors.password}
//               />
//             </View>

//             {/* Mobile Number */}
//             <View style={globalStyles.field}>
//               <TextInput
//                 label="Mobile Number"
//                 value={mobile}
//                 onChangeText={(t) => {
//                   const digits = t.replace(/[^\d]/g, '');
//                   setMobile(digits);
//                   if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: undefined }));
//                 }}
//                 keyboardType="phone-pad"
//                 maxLength={10}
//                 error={errors.mobile}
//               />
//             </View>

//             {/* Form-level error */}
//             {formError ? (
//               <Text style={[typography.error, globalStyles.errorText]}>{formError}</Text>
//             ) : null}

//             {/* CTA */}
//             <Button
//               title={submitting ? 'Creating account...' : 'Sign Up'}
//               onPress={onSubmit}
//               style={styles.button}
//               disabled={submitting}
//             />
//           </View>

//           {/* Footer */}
//           <TouchableOpacity style={styles.footer} onPress={()=> navigation.navigate("Login")}>
//             <Text style={typography.caption}>
//               Already have an account? <Text style={typography.link}>Login</Text>
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   flex: { flex: 1 },
//   scrollContent: { flexGrow: 1 },

//   container: {
//     ...layout.screen,
//     paddingHorizontal: spacing['2xl'],
//     paddingTop: spacing['3xl'],
//     paddingBottom: spacing['2xl'],
//   },

//   header: {
//     marginBottom: spacing.xl,
//   },

//   subtitle: {
//     marginTop: spacing.sm,
//   },

//   button: {
//     marginTop: spacing.md,
//   },

//   footer: {
//     marginTop: spacing.xl,
//     alignItems: 'center',
//   },
// });

// src/screens/Auth/SignupScreen.js
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

const isEmail = (v) => /\S+@\S+\.\S+/.test(v);
const isStrongPassword = (v) => typeof v === 'string' && v.length >= 6;
const isFullName = (v) => typeof v === 'string' && v.trim().split(/\s+/).length >= 2;
const isMobileNumber = (v) => /^[0-9]{10}$/.test(v);

import { globalStyles, layout, shadows, spacing, typography } from '../../utils';

// ✅ Add these imports
import { signUpWithEmail } from '../../services/auth';
import { saveUserSession } from '../../services/session';

export default function SignupScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [mobile,   setMobile]   = useState('');

  const [errors, setErrors]         = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError]   = useState(null);

  const validate = () => {
    const errs = {};
    if (!isFullName(fullName)) errs.fullName = 'Please enter your first & last name';
    if (!isEmail(email))       errs.email    = 'Please enter a valid email address';
    if (!isStrongPassword(password)) errs.password = 'Password must be at least 6 characters';
    if (!isMobileNumber(mobile)) errs.mobile = 'Enter a 10-digit mobile number';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // 🔄 Map common Firebase errors to friendly messages
  const friendlyError = (code, message) => {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Try logging in.';
      case 'auth/invalid-email':
        return 'The email address is invalid.';
      case 'auth/weak-password':
        return 'Password is too weak. Use 6+ characters.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      default:
        return message || 'Sign up failed. Please try again.';
    }
  };

  const onSubmit = async () => {
    if (submitting) return; // prevent double-taps
    setFormError(null);
    if (!validate()) return;

    try {
      setSubmitting(true);

      // ✅ Create auth user + Firestore profile
      const appUser = await signUpWithEmail({
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: mobile,
      });

      // ✅ Persist session for quick hydration on next launch
      await saveUserSession(appUser);

      // ✅ Success UI
      Alert.alert('Account created', 'You can now log in.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);

      // If you want to directly go to App stack instead of Login:
      // navigation.reset({ index: 0, routes: [{ name: 'Home' }] });

    } catch (e) {
      const msg = friendlyError(e?.code, e?.message);
      setFormError(msg);
      Alert.alert('Sign Up Error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={typography.title}>Create your account</Text>
            <Text style={[typography.subtitle, styles.subtitle]}>It only takes a minute</Text>
          </View>

          {/* Card */}
          <View style={[globalStyles.card, shadows.card]}>
            {/* Full Name */}
            <View style={globalStyles.field}>
              <TextInput
                label="Full Name"
                value={fullName}
                onChangeText={(t) => {
                  setFullName(t);
                  if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
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

            {/* Mobile Number */}
            <View style={globalStyles.field}>
              <TextInput
                label="Mobile Number"
                value={mobile}
                onChangeText={(t) => {
                  const digits = t.replace(/[^\d]/g, '');
                  setMobile(digits);
                  if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: undefined }));
                }}
                keyboardType="phone-pad"
                maxLength={10}
                error={errors.mobile}
              />
            </View>

            {/* Form-level error */}
            {formError ? (
              <Text style={[typography.error, globalStyles.errorText]}>{formError}</Text>
            ) : null}

            {/* CTA */}
            <Button
              title={submitting ? 'Creating account...' : 'Sign Up'}
              onPress={onSubmit}
              style={styles.button}
              disabled={submitting}
            />
          </View>

          {/* Footer */}
          <TouchableOpacity style={styles.footer} onPress={() => navigation.navigate('Login')}>
            <Text style={typography.caption}>
              Already have an account? <Text style={typography.link}>Login</Text>
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
});
