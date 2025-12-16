import { useNavigation } from "@react-navigation/native";
import { signOut, updateEmail, updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../../components/common/AppHeader";
import Button from "../../components/common/Button";
import TextInput from "../../components/common/TextInput";
import { useAuth } from "../../core/auth/useAuth";
import { auth } from "../../core/firebase/authInstance";

/* ---------------- helpers ---------------- */
const isEmail = (v) => /\S+@\S+\.\S+/.test(v);
const isPhone10 = (v) => /^[0-9]{10}$/.test(v);
const isNonEmpty = (v) => typeof v === "string" && v.trim().length > 0;

const COLORS = {
  background: "#ffffff",
  card: "#FFFFFF",
  text: "#0F172A",
  textMuted: "#64748B",
  primary: "#2563EB",
  border: "#E2E8F0",
  danger: "#EF4444",
  shadow: "#000",
};

const initialsFromName = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");

const SettingRow = ({ title, subtitle }) => (
  <View style={styles.row}>
    <Text style={styles.rowTitle}>{title}</Text>
    {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
  </View>
);

export default function ProfileSettingsScreen() {
  const navigation = useNavigation();
  const user = useAuth();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setProfile({
      name: user.displayName || "",
      email: user.email || "",
      phone: user.phoneNumber || "",
    });
  }, [user]);

  const validate = () => {
    const errs = {};
    if (!isNonEmpty(profile.name)) errs.name = "Please enter your full name";
    if (!isEmail(profile.email)) errs.email = "Please enter a valid email";
    if (!isPhone10(profile.phone)) errs.phone = "Enter a 10-digit phone number";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onSave = async () => {
    if (!validate() || !user) return;
    try {
      setSaving(true);
      await updateProfile(user, { displayName: profile.name });
      if (profile.email !== user.email) {
        await updateEmail(user, profile.email);
      }
      await user.reload();
      Alert.alert("Success", "Profile updated successfully");
    } catch (err) {
      Alert.alert("Update failed", err.message || "Try again later");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch {
      Alert.alert("Logout failed", "Please try again");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <AppHeader title="Settings" showBack />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {initialsFromName(profile.name)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Profile Settings</Text>
              <Text style={styles.subtitle}>
                Manage your personal information
              </Text>
            </View>
          </View>

          {/* Profile Card */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Your Details</Text>

            <TextInput
              label="Full Name"
              value={profile.name}
              onChangeText={(t) => setProfile((p) => ({ ...p, name: t }))}
              error={errors.name}
            />

            <TextInput
              label="Email"
              value={profile.email}
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={(t) => setProfile((p) => ({ ...p, email: t }))}
              error={errors.email}
            />

            <View style={styles.actionsRow}>
              <Button
                title={saving ? "Saving..." : "Save"}
                onPress={onSave}
                style={{ flex: 1 }}
              />
              <Button
                title="Logout"
                onPress={handleLogout}
                style={[{ flex: 1 }, { backgroundColor: COLORS.danger }]}
              />
            </View>
          </View>

          {/* About Section */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>About</Text>
            <SettingRow
              title="About this app"
              subtitle="E-commerce demo application"
            />
            <SettingRow
              title="Developer"
              subtitle="Built using React Native CLI"
            />
          </View>

          {/* Legal Section */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Legal</Text>
            <SettingRow title="Privacy Policy" />
            <SettingRow title="Terms & Conditions" />
            <SettingRow title="Open Source Licenses" />
          </View>

          {/* App Info */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>App Info</Text>
            <SettingRow title="Version" subtitle="1.0.0" />
            <SettingRow title="Framework" subtitle="React Native CLI 0.82.1" />
            <SettingRow title="State Management" subtitle="Redux Toolkit" />
            <SettingRow title="Authentication" subtitle="Firebase Auth" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ---------------- styles ---------------- */
const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 40 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    elevation: 3,
  },

  avatarText: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },

  title: { fontSize: 24, fontWeight: "700", color: COLORS.text },
  subtitle: { marginTop: 4, fontSize: 14, color: COLORS.textMuted },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 18,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 12,
    color: COLORS.text,
  },

  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
    justifyContent: "space-between",
  },

  row: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
  },

  rowTitle: { fontSize: 15, fontWeight: "600", color: COLORS.text },
  rowSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.textMuted,
  },
});