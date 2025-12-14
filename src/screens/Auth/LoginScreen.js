// import { useState } from "react";
// import {
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import Button from "../../components/common/Button";
// import TextInput from "../../components/common/TextInput";
// import { colors, globalStyles, layout, shadows, spacing } from "../../utils";
// import { isEmail } from "../../utils/validators";
// import { SafeAreaView } from "react-native-safe-area-context";

// import { signInWithEmail } from "../../core/firebase/auth";
// import { saveUserSession } from "../../services/session";

// const isNotEmpty = (v) => typeof v === "string" && v.trim().length > 0;

// export default function LoginScreen({ navigation }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errors, setErrors] = useState({});
//   const [submitting, setSubmitting] = useState(false);
//   const [formError, setFormError] = useState(null);

//   console.log("🔥 LoginScreen mounted");

//   const validate = () => {
//     const errs = {};
//     if (!isEmail(email)) errs.email = "Please enter a valid email";
//     if (!isNotEmpty(password)) errs.password = "Please enter your password";
//     setErrors(errs);
//     return Object.keys(errs).length === 0;
//   };

//   const friendlyError = (code) => {
//     switch (code) {
//       case "auth/invalid-email":
//       case "auth/missing-email":
//         return "Invalid email.";
//       case "auth/user-not-found":
//         return "No account found.";
//       case "auth/wrong-password":
//         return "Incorrect password.";
//       default:
//         return "Something went wrong.";
//     }
//   };

//   const onSubmit = async () => {
//     console.log("🟦 onSubmit triggered");
//     console.log("🟦 email:", email);
//     console.log("🟦 password length:", password.length);

//     if (submitting) {
//       console.log("⚠️ Already submitting... ignoring");
//       return;
//     }

//     setFormError(null);
//     if (!validate()) {
//       console.log("❌ Validation failed:", errors);
//       return;
//     }

//     try {
//       setSubmitting(true);

//       console.log("🔥 Calling signInWithEmail...");
//       const user = await signInWithEmail(
//         email.trim().toLowerCase(),
//         password
//       );

//       console.log("✅ signInWithEmail success:", user);

//       console.log("💾 Saving user session...");
//       await saveUserSession(user);

//       console.log("🔄 Resetting navigation to Home");
//       // navigation.reset({
//       //   index: 0,
//       //   routes: [{ name: "Home" }],
//       // });
//        navigation.navigate("Home");

//     } catch (e) {
//       console.log("❌ Firebase Login Error:");
//       console.log("   → code:", e?.code);
//       console.log("   → message:", e?.message);
//       console.log("   → full error:", e);

//       setFormError(friendlyError(e?.code));
//     } finally {
//       console.log("🟦 Finished submit cycle");
//       setSubmitting(false);
//     }
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
//       <KeyboardAvoidingView
//         style={styles.flex}
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//       >
//         <ScrollView contentContainerStyle={styles.scrollContent}>
//           <View style={styles.container}>
//             <View style={styles.header}>
//               <Text style={styles.title}>Welcome back</Text>
//               <Text style={styles.subtitle}>Sign in to continue</Text>
//             </View>

//             <View style={[globalStyles.card, shadows.card]}>
//               <View style={globalStyles.field}>
//                 <TextInput
//                   label="Email"
//                   value={email}
//                   onChangeText={(t) => {
//                     setEmail(t);
//                     if (errors.email)
//                       setErrors((p) => ({ ...p, email: undefined }));
//                   }}
//                   autoCapitalize="none"
//                   keyboardType="email-address"
//                   error={errors.email}
//                 />
//               </View>

//               <View style={globalStyles.field}>
//                 <TextInput
//                   label="Password"
//                   value={password}
//                   onChangeText={(t) => {
//                     setPassword(t);
//                     if (errors.password)
//                       setErrors((p) => ({ ...p, password: undefined }));
//                   }}
//                   secureTextEntry
//                   error={errors.password}
//                 />
//               </View>

//               {formError ? (
//                 <Text style={styles.errorText}>{formError}</Text>
//               ) : null}

//               <Button
//                 title={submitting ? "Signing in..." : "Login"}
//                 onPress={onSubmit}
//                 disabled={submitting}
//               />
//             </View>

//             <TouchableOpacity
//               style={styles.footer}
//               onPress={() => navigation.navigate("Signup")}
//             >
//               <Text style={styles.footerText}>
//                 Don’t have an account?{" "}
//                 <Text style={styles.footerLink}>Sign up</Text>
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   flex: { flex: 1 },
//   scrollContent: { flexGrow: 1 },
//   container: {
//     ...layout.screen,
//     paddingHorizontal: spacing["2xl"],
//     paddingTop: spacing["3xl"],
//     paddingBottom: spacing["2xl"],
//   },
//   header: { marginBottom: spacing.xl },
//   title: { fontSize: 28, fontWeight: "700" },
//   subtitle: { marginTop: spacing.sm, opacity: 0.6 },
//   footer: { marginTop: spacing.xl, alignItems: "center" },
//   footerText: { fontSize: 14 },
//   footerLink: { color: colors.primary, fontWeight: "600" },
//   errorText: { color: "red", marginTop: 8 },
// });
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../../components/common/Button";
import TextInput from "../../components/common/TextInput";
import { colors, globalStyles, layout, shadows, spacing } from "../../utils";
import { isEmail } from "../../utils/validators";
import { SafeAreaView } from "react-native-safe-area-context";

import { signInWithEmail } from "../../core/firebase/auth";
import { saveUserSession } from "../../services/session";

const isNotEmpty = (v) => typeof v === "string" && v.trim().length > 0;

export default function LoginScreen({ navigation, onLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const validate = () => {
    const errs = {};
    if (!isEmail(email)) errs.email = "Please enter a valid email";
    if (!isNotEmpty(password)) errs.password = "Please enter your password";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const friendlyError = (code) => {
    switch (code) {
      case "auth/invalid-email":
      case "auth/missing-email":
        return "Invalid email.";
      case "auth/user-not-found":
        return "No account found.";
      case "auth/wrong-password":
        return "Incorrect password.";
      default:
        return "Something went wrong.";
    }
  };

  const onSubmit = async () => {
    if (submitting) return;

    setFormError(null);
    if (!validate()) return;

    try {
      setSubmitting(true);

      const user = await signInWithEmail(
        email.trim().toLowerCase(),
        password
      );

      await saveUserSession(user);

      // 🔥 CALL NAV CALLBACK FROM ROOTNAV (THIS IS THE ONLY CHANGE)
      onLoggedIn?.();

    } catch (e) {
      setFormError(friendlyError(e?.code));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.container}>
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
                    if (errors.email)
                      setErrors((p) => ({ ...p, email: undefined }));
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
                      setErrors((p) => ({ ...p, password: undefined }));
                  }}
                  secureTextEntry
                  error={errors.password}
                />
              </View>

              {formError ? (
                <Text style={styles.errorText}>{formError}</Text>
              ) : null}

              <Button
                title={submitting ? "Signing in..." : "Login"}
                onPress={onSubmit}
                disabled={submitting}
              />
            </View>

            <TouchableOpacity
              style={styles.footer}
              onPress={() => navigation.navigate("Signup")}
            >
              <Text style={styles.footerText}>
                Don’t have an account?{" "}
                <Text style={styles.footerLink}>Sign up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  container: {
    ...layout.screen,
    paddingHorizontal: spacing["2xl"],
    paddingTop: spacing["3xl"],
    paddingBottom: spacing["2xl"],
  },
  header: { marginBottom: spacing.xl },
  title: { fontSize: 28, fontWeight: "700" },
  subtitle: { marginTop: spacing.sm, opacity: 0.6 },
  footer: { marginTop: spacing.xl, alignItems: "center" },
  footerText: { fontSize: 14 },
  footerLink: { color: colors.primary, fontWeight: "600" },
  errorText: { color: "red", marginTop: 8 },
});
