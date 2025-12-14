import { useNavigation } from "@react-navigation/native";
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
import { colors } from "../../utils";
import { signOut, updateEmail, updateProfile } from "firebase/auth";
import { useAuth } from "../../core/auth/useAuth";
import { auth } from "../../core/firebase/authInstance";


const isEmail = (v) => /\S+@\S+\.\S+/.test(v);
const isPhone10 = (v) => /^[0-9]{10}$/.test(v);
const isNonEmpty = (v) => typeof v === "string" && v.trim().length > 0;

const COLORS = {
  background: "#F8FAFD",
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

export default function ProfileSettingsScreen() {
  const navigation = useNavigation();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const user = useAuth();

  const styles = makeStyles();

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
    console.log("Saving profile..new.");
    if (!validate()) return;
    if (!user) return Alert.alert("Error", "User not logged in");

    try {
      setSaving(true);

      // 1️⃣ Update display name
      await updateProfile(user, {
        displayName: profile.name,
      });

      // 2️⃣ Update email (if changed)
      if (profile.email !== user.email) {
        await updateEmail(user, profile.email);
      }

      // 3️⃣ 🔥 Force Firebase to refresh user object
      await user.reload();

      Alert.alert("Success", "Profile updated 👍");
    } catch (err) {
      console.log("Update error:", err);

      Alert.alert(
        "Update failed",
        err.message || "Could not update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch {
      Alert.alert("Logout failed", "Try again.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <AppHeader title="Settings" showBack />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {initialsFromName(profile.name)}
                </Text>
              </View>

              <View style={styles.headerText}>
                <Text style={styles.title}>Profile Settings</Text>
                <Text style={styles.subtitle}>
                  Manage your personal information
                </Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Your Details</Text>

              <View style={styles.field}>
                <TextInput
                  label="Full Name"
                  value={profile.name}
                  onChangeText={(t) => {
                    setProfile((p) => ({ ...p, name: t }));
                    if (errors.name)
                      setErrors((e) => ({ ...e, name: undefined }));
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
                    if (errors.email)
                      setErrors((e) => ({ ...e, email: undefined }));
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email}
                />
              </View>

              <View style={styles.actionsRow}>
                <Button
                  title={saving ? "Saving..." : "Save"}
                  onPress={onSave}
                  style={styles.saveBtn}
                />

                <Button
                  title="Logout"
                  onPress={handleLogout}
                  style={styles.logoutBtn}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    scroll: { paddingBottom: 30 },

    container: {
      paddingHorizontal: 20,
      paddingTop: 16,
    },

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
      shadowColor: COLORS.shadow,
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 3,
    },

    avatarText: {
      fontSize: 20,
      fontWeight: "700",
      color: COLORS.text,
    },

    headerText: { flex: 1 },

    title: {
      fontSize: 24,
      fontWeight: "700",
      color: COLORS.text,
    },

    subtitle: {
      marginTop: 4,
      fontSize: 14,
      color: COLORS.textMuted,
    },

    card: {
      backgroundColor: COLORS.card,
      borderRadius: 16,
      padding: 18,
      borderWidth: 1,
      borderColor: COLORS.border,
      marginBottom: 18,
      shadowColor: COLORS.shadow,
      shadowOpacity: 0.06,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },

    sectionTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: COLORS.text,
      marginBottom: 12,
    },

    field: { marginBottom: 14 },

    actionsRow: {
      flexDirection: "row",
      marginTop: 8,
      gap: 10,
    },

    saveBtn: { flex: 1 },

    logoutBtn: {
      flex: 1,
      backgroundColor: COLORS.danger,
    },
  });
