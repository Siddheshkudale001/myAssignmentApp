import { useNavigation, useRoute } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { spacing } from "../../utils";
const PRIMARY = "#3B82F6";

export default function AppHeader({
  title,
  showBack = false,
  showFav = false,
  showProfile = false,
  showSearch = false,
  search,
  onChangeSearch,
}) {
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();
  const route = useRoute();
  const isLandscape = width > height;
  const iconSize = isLandscape ? 18 : 22;

  const screenTitle = title || route.name;
  return (
    <View style={styles.wrapper}>
      {/* TOP BAR */}
      <View
        style={isLandscape ? [
          styles.container_rotated,
        ] : styles.container}
      >
        {/* LEFT */}
        <View style={styles.side}>
          {showBack && (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[styles.iconButton, styles.primaryButton]}
              activeOpacity={0.8}
            >
              <Text style={[styles.icon, styles.primaryIcon]}>←</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* TITLE */}
        <Text numberOfLines={1} style={styles.title}>
          {screenTitle}
        </Text>

        {/* RIGHT */}
        <View style={[styles.side, styles.right]}>
          {showFav && (
            <TouchableOpacity
              onPress={() => navigation.navigate("Favorites")}
              // style={styles.iconButton}
              style={[styles.iconButton, styles.primaryButton]}
              activeOpacity={0.7}
            >
              <Text style={[styles.icon, styles.primaryIcon, { fontSize: iconSize }]}>♥</Text>
            </TouchableOpacity>
          )}

          {showProfile && (
            <TouchableOpacity
              onPress={() => navigation.navigate("ProfileSettings")}
              // style={[styles.iconButton, showFav && { marginLeft: 8 }]}
              style={[styles.iconButton, styles.primaryButton]}
              activeOpacity={0.7}
            >
              <Text style={[styles.icon, styles.primaryIcon, { fontSize: iconSize }]}>⚙︎</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* SEARCH */}
      {showSearch && (
        <View style={styles.searchWrapper}>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              placeholder="Search products"
              placeholderTextColor="#94a3b8"
              value={search}
              onChangeText={onChangeSearch}
              style={styles.searchInput}
            />
            {search?.length > 0 && (
              <TouchableOpacity onPress={() => onChangeSearch?.("")}>
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#3B82F6",
  },

  container: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    backgroundColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
    container_rotated: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing["4xl"],
    backgroundColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  side: {
    minWidth: 48,
    justifyContent: "center",
    flexShrink: 0,
  },
  containerLandscape: {
    height: 48,
    paddingHorizontal: spacing.md,
  },

  right: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f5f9",
  },

  /* PRIMARY STATE (easy to revert) */
  primaryButton: {
    backgroundColor: PRIMARY,
  },

  icon: {
    fontSize: 18,
    color: "#111",
  },

  primaryIcon: {
    color: "#fff",
  },

  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: 0.3,
  },

  searchWrapper: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: PRIMARY,
  },

  searchIcon: {
    fontSize: 16,
    marginRight: 6,
    color: PRIMARY,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#0f172a",
  },

  clearIcon: {
    fontSize: 14,
    color: PRIMARY,
    marginLeft: 6,
  },
});
