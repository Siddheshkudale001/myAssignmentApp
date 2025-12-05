
// import React, { useMemo, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Platform,
//   KeyboardAvoidingView,
//   ScrollView,
//   Alert,
//   Switch,
// } from 'react-native';
// import TextInput from '../../components/common/TextInput';
// import Button from '../../components/common/Button';

// // --- Validators (inline to keep this file self-contained) ---
// const isEmail = (v) => /\S+@\S+\.\S+/.test(v);
// const isPhone10 = (v) => /^[0-9]{10}$/.test(v);
// const isNonEmpty = (v) => typeof v === 'string' && v.trim().length > 0;

// // --- Palettes: light/dark ---
// const LIGHT = {
//   background: '#F5F7FB',
//   card: '#FFFFFF',
//   text: '#111827',
//   textMuted: '#6B7280',
//   primary: '#3B82F6',
//   border: '#E5E7EB',
//   shadow: '#000',
//   danger: '#EF4444',
//   success: '#16A34A',
// };

// const DARK = {
//   background: '#0B0E11',
//   card: '#14171C',
//   text: '#F3F4F6',
//   textMuted: '#9CA3AF',
//   primary: '#60A5FA',
//   border: '#1F2937',
//   shadow: '#000',
//   danger: '#EF4444',
//   success: '#16A34A',
// };

// // --- Helpers ---
// const initialsFromName = (name) =>
//   name
//     .split(/\s+/)
//     .filter(Boolean)
//     .slice(0, 2)
//     .map((s) => s[0]?.toUpperCase() ?? '')
//     .join('');

// const formatINR = (value) => {
//   try {
//     return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
//   } catch {
//     return `₹${Number(value).toFixed(2)}`;
//   }
// };

// export default function ProfileSettingsScreen() {
//   // Demo initial data (static)
//   const [profile, setProfile] = useState({
//     name: 'Siddhesh Krishna Kudale',
//     email: 'siddhesh@example.com',
//     phone: '9876543210',
//   });

//   const [errors, setErrors] = useState({});
//   const [saving, setSaving] = useState(false);

//   // Theme toggle (local, no Provider)
//   const [isDark, setIsDark] = useState(false);
//   const COLORS = isDark ? DARK : LIGHT;
//   const styles = useMemo(() => makeStyles(COLORS), [COLORS]);

//   const validate = () => {
//     const errs = {};
//     if (!isNonEmpty(profile.name)) errs.name = 'Please enter your full name';
//     if (!isEmail(profile.email)) errs.email = 'Please enter a valid email';
//     if (!isPhone10(profile.phone)) errs.phone = 'Enter a 10-digit phone number';
//     setErrors(errs);
//     return Object.keys(errs).length === 0;
//   };

//   const onSave = async () => {
//     if (!validate()) return;
//     try {
//       setSaving(true);
//       // Mock save
//       await new Promise((r) => setTimeout(r, 700));
//       Alert.alert('Profile updated', 'Your changes have been saved.');
//     } catch (e) {
//       Alert.alert('Error', e?.message ?? 'Failed to save profile');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const onLogout = () => {
//     // Mock logout: clear form or show message
//     Alert.alert('Logged out', 'You have been logged out (mock).');
//   };

//   return (
//     <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
//       <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
//         <View style={styles.container}>
//           {/* Header with Avatar */}
//           <View style={styles.header}>
//             <View style={styles.avatar}>
//               <Text style={styles.avatarText}>{initialsFromName(profile.name)}</Text>
//             </View>
//             <View style={styles.headerText}>
//               <Text style={styles.title}>Profile & Settings</Text>
//               <Text style={styles.subtitle}>Manage your account preferences</Text>
//             </View>
//           </View>

//           {/* Theme Toggle */}
//           <View style={styles.card}>
//             <View style={styles.rowBetween}>
//               <View>
//                 <Text style={styles.sectionTitle}>Appearance</Text>
//                 <Text style={styles.sectionDesc}>Switch between light and dark theme</Text>
//               </View>
//               <View style={styles.switchRow}>
//                 <Text style={styles.switchLabel}>{isDark ? 'Dark' : 'Light'}</Text>
//                 <Switch
//                   value={isDark}
//                   onValueChange={setIsDark}
//                   trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
//                   thumbColor={isDark ? '#2563EB' : '#FFFFFF'}
//                 />
//               </View>
//             </View>
//           </View>

//           {/* Profile Form */}
//           <View style={styles.card}>
//             <Text style={styles.sectionTitle}>Profile</Text>
//             <View style={styles.field}>
//               <TextInput
//                 label="Full Name"
//                 value={profile.name}
//                 onChangeText={(t) => {
//                   setProfile((p) => ({ ...p, name: t }));
//                   if (errors.name) setErrors((e) => ({ ...e, name: undefined }));
//                 }}
//                 error={errors.name}
//               />
//             </View>
//             <View style={styles.field}>
//               <TextInput
//                 label="Email"
//                 value={profile.email}
//                 onChangeText={(t) => {
//                   setProfile((p) => ({ ...p, email: t }));
//                   if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
//                 }}
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//                 error={errors.email}
//               />
//             </View>
//             <View style={styles.field}>
//               <TextInput
//                 label="Phone"
//                 value={profile.phone}
//                 onChangeText={(t) => {
//                   const digits = t.replace(/[^\d]/g, '');
//                   setProfile((p) => ({ ...p, phone: digits }));
//                   if (errors.phone) setErrors((e) => ({ ...e, phone: undefined }));
//                 }}
//                 keyboardType="phone-pad"
//                 maxLength={10}
//                 error={errors.phone}
//               />
//             </View>

//             {/* Actions */}
//             <View style={styles.actionsRow}>
//               <Button
//                 title={saving ? 'Saving...' : 'Save Changes'}
//                 onPress={onSave}
//                 style={styles.saveBtn}
//                 disabled={saving}
//               />
//               <Button
//                 title="Logout"
//                 onPress={onLogout}
//                 style={styles.logoutBtn}
//               />
//             </View>
//           </View>

//           {/* Account summary (optional) */}
//           <View style={styles.card}>
//             <Text style={styles.sectionTitle}>Account Summary</Text>
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>Plan</Text>
//               <Text style={styles.summaryValue}>Free</Text>
//             </View>
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>Last purchase</Text>
//               <Text style={styles.summaryValue}>{formatINR(0)}</Text>
//             </View>
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>Theme</Text>
//               <Text style={styles.summaryValue}>{isDark ? 'Dark' : 'Light'}</Text>
//             </View>
//           </View>

//           {/* Footer hint */}
//           <View style={styles.footer}>
//             <Text style={styles.footerText}>
//               Tip: Long press products in the list to add them to Favorites.
//             </Text>
//           </View>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// // --- Styles factory so we can swap palettes at runtime ---
// const makeStyles = (COLORS) =>
//   StyleSheet.create({
//     flex: { flex: 1 },
//     scrollContent: { flexGrow: 1 },
//     container: {
//       flex: 1,
//       backgroundColor: COLORS.background,
//       paddingHorizontal: 20,
//       paddingTop: 24,
//       paddingBottom: 24,
//     },

//     // Header & avatar
//     header: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       marginBottom: 12,
//       gap: 12,
//     },
//     avatar: {
//       width: 56,
//       height: 56,
//       borderRadius: 28,
//       backgroundColor: '#E0E7FF',
//       alignItems: 'center',
//       justifyContent: 'center',
//     },
//     avatarText: {
//       fontSize: 20,
//       fontWeight: '800',
//       color: '#1E293B',
//     },
//     headerText: { flex: 1 },
//     title: {
//       fontSize: 22,
//       fontWeight: '700',
//       color: COLORS.text,
//     },
//     subtitle: {
//       marginTop: 4,
//       fontSize: 13,
//       color: COLORS.textMuted,
//     },

//     // Card
//     card: {
//       backgroundColor: COLORS.card,
//       borderRadius: 14,
//       padding: 16,
//       marginTop: 12,
//       // subtle shadow/elevation
//       shadowColor: COLORS.shadow,
//       shadowOpacity: 0.06,
//       shadowRadius: 10,
//       shadowOffset: { width: 0, height: 3 },
//       elevation: 2,
//       borderWidth: Platform.OS === 'ios' ? 0.5 : 0,
//       borderColor: COLORS.border,
//     },

//     sectionTitle: {
//       fontSize: 16,
//       fontWeight: '700',
//       color: COLORS.text,
//       marginBottom: 10,
//     },
//     sectionDesc: {
//       fontSize: 12.5,
//       color: COLORS.textMuted,
//     },

//     rowBetween: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//     },
//     switchRow: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       gap: 8,
//     },
//     switchLabel: {
//       fontSize: 13,
//       color: COLORS.text,
//       fontWeight: '600',
//     },

//     // Fields
//     field: { marginBottom: 12 },

//     // Actions
//     actionsRow: {
//       flexDirection: 'row',
//       gap: 10,
//       marginTop: 4,
//     },
//     saveBtn: {},
//     logoutBtn: {
//       backgroundColor: COLORS.danger,
//     },

//     // Summary
//     summaryRow: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       paddingVertical: 8,
//       borderTopWidth: 1,
//       borderColor: COLORS.border,
//     },
//     summaryLabel: {
//       fontSize: 13,
//       color: COLORS.textMuted,
//     },
//     summaryValue: {
//       fontSize: 13,
//       color: COLORS.text,
//       fontWeight: '600',
//     },

//     // Footer
//     footer: {
//       marginTop: 16,
//       alignItems: 'center',
//     },
//     footerText: {
//       fontSize: 12.5,
//       color: COLORS.textMuted,
//     },
//   });

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import TextInput from '../../components/common/TextInput';
import Button from '../../components/common/Button';

// Validators (KISS)
const isEmail = (v) => /\S+@\S+\.\S+/.test(v);
const isPhone10 = (v) => /^[0-9]{10}$/.test(v);
const isNonEmpty = (v) => typeof v === 'string' && v.trim().length > 0;

// Palettes
const LIGHT = {
  background: '#F5F7FB',
  card: '#FFFFFF',
  text: '#111827',
  textMuted: '#6B7280',
  primary: '#3B82F6',
  border: '#E5E7EB',
  shadow: '#000',
  danger: '#EF4444',
  success: '#16A34A',
};

const DARK = {
  background: '#0B0E11',
  card: '#14171C',
  text: '#F3F4F6',
  textMuted: '#9CA3AF',
  primary: '#60A5FA',
  border: '#1F2937',
  shadow: '#000',
  danger: '#EF4444',
  success: '#16A34A',
};

// Helpers
const initialsFromName = (name) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? '')
    .join('');

const formatINR = (value) => {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
  } catch {
    return `₹${Number(value).toFixed(2)}`;
  }
};

export default function ProfileSettingsScreen() {
  const [profile, setProfile] = useState({
    name: 'Siddhesh Krishna Kudale',
    email: 'siddhesh@example.com',
    phone: '9876543210',
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Local theme toggle (KISS)
  const [isDark, setIsDark] = useState(false);
  const COLORS = isDark ? DARK : LIGHT;
  const styles = useMemo(() => makeStyles(COLORS), [COLORS]);

  const validate = () => {
    const errs = {};
    if (!isNonEmpty(profile.name)) errs.name = 'Please enter your full name';
    if (!isEmail(profile.email)) errs.email = 'Please enter a valid email';
    if (!isPhone10(profile.phone)) errs.phone = 'Enter a 10-digit phone number';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onSave = async () => {
    if (!validate()) return;
    try {
      setSaving(true);
      await new Promise((r) => setTimeout(r, 700));
      Alert.alert('Profile updated', 'Your changes have been saved.');
    } catch (e) {
      Alert.alert('Error', e?.message ?? 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const onLogout = () => {
    Alert.alert('Logged out', 'You have been logged out (mock).');
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          {/* Header with Avatar */}
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initialsFromName(profile.name)}</Text>
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>Profile & Settings</Text>
              <Text style={styles.subtitle}>Manage your account preferences</Text>
            </View>
          </View>

          {/* Theme Toggle */}
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.sectionTitle}>Appearance</Text>
                <Text style={styles.sectionDesc}>Switch between light and dark theme</Text>
              </View>
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>{isDark ? 'Dark' : 'Light'}</Text>
                <Switch
                  value={isDark}
                  onValueChange={setIsDark}
                  trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                  thumbColor={isDark ? '#2563EB' : '#FFFFFF'}
                />
              </View>
            </View>
          </View>

          {/* Profile Form */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Profile</Text>

            <View style={styles.field}>
              <TextInput
                label="Full Name"
                value={profile.name}
                onChangeText={(t) => {
                  setProfile((p) => ({ ...p, name: t }));
                  if (errors.name) setErrors((e) => ({ ...e, name: undefined }));
                }}
                error={errors.name}
              />
            </View>

            <View style={styles.field}>
              <TextInput
                label="Email"
                value={profile.email}
                onChangeText={(t) => {
                  setProfile((p) => ({ ...p, email: t }));
                  if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
              />
            </View>

            <View style={styles.field}>
              <TextInput
                label="Phone"
                value={profile.phone}
                onChangeText={(t) => {
                  const digits = t.replace(/[^\d]/g, '');
                  setProfile((p) => ({ ...p, phone: digits }));
                  if (errors.phone) setErrors((e) => ({ ...e, phone: undefined }));
                }}
                keyboardType="phone-pad"
                maxLength={10}
                error={errors.phone}
              />
            </View>

            {/* Actions */}
            <View style={styles.actionsRow}>
              <Button
                title={saving ? 'Saving...' : 'Save Changes'}
                onPress={onSave}
                style={styles.saveBtn}
                disabled={saving}
              />
              <Button title="Logout" onPress={onLogout} style={styles.logoutBtn} />
            </View>
          </View>

          {/* Account summary */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Account Summary</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Plan</Text>
              <Text style={styles.summaryValue}>Free</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Last purchase</Text>
              <Text style={styles.summaryValue}>{formatINR(0)}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Theme</Text>
              <Text style={styles.summaryValue}>{isDark ? 'Dark' : 'Light'}</Text>
            </View>
          </View>

          {/* Footer hint */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Tip: Long press products in the list to add them to Favorites.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// --- Styles factory: consume palette for dynamic theming ---
const makeStyles = (COLORS) =>
  StyleSheet.create({
    flex: { flex: 1 },
    scrollContent: { flexGrow: 1 },

    container: {
      flex: 1,
      backgroundColor: COLORS.background,
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 24,
    },

    // Header
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: COLORS.card,
      borderWidth: 1,
      borderColor: COLORS.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
      // subtle shadow/elevation
      shadowColor: COLORS.shadow,
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 2,
    },
    avatarText: {
      fontSize: 18,
      fontWeight: '700',
      color: COLORS.text,
      letterSpacing: 0.3,
    },
    headerText: { flex: 1 },
    title: { fontSize: 22, fontWeight: '700', color: COLORS.text },
    subtitle: { marginTop: 4, fontSize: 13, color: COLORS.textMuted },

    // Card
    card: {
      backgroundColor: COLORS.card,
      borderRadius: 14,
      padding: 16,
      borderWidth: 1,
      borderColor: COLORS.border,
      marginBottom: 16,
      shadowColor: COLORS.shadow,
      shadowOpacity: 0.06,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 3 },
      elevation: 2,
    },

    // Row utilities
    rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    switchRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    switchLabel: { marginRight: 8, fontSize: 13, color: COLORS.textMuted },

    // Section typography
    sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
    sectionDesc: { marginTop: 4, fontSize: 13, color: COLORS.textMuted },

    // Form
    field: { marginBottom: 12 },

    actionsRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
    saveBtn: { flex: 1 },
    logoutBtn: {
      flex: 1,
      backgroundColor: COLORS.danger, // assuming your Button supports bg override
    },

    // Summary
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
    },
    summaryLabel: { fontSize: 13, color: COLORS.textMuted },
    summaryValue: { fontSize: 14, color: COLORS.text, fontWeight: '600' },

    // Footer
    footer: { alignItems: 'center', marginTop: 8 },
    footerText: { fontSize: 12, color: COLORS.textMuted, textAlign: 'center' },
  });
