import { useNavigation, useRoute } from "@react-navigation/native";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { spacing, typography } from "../../utils";

export default function AppHeader({
  title,
  showBack = false,
  showFav = false,
  showProfile = false,
  showSearch = false,
  search,
  onChangeSearch,
}) {
  const navigation = useNavigation();
  const route = useRoute();

  const screenTitle = title || route.name;

  return (
    <View>
      {/* TOP BAR */}
      <View style={styles.container}>
        {/* BACK */}
        {showBack ? (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.leftIcon}
          >
            <Text style={styles.icon}>←</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.leftIcon} />
        )}

        {/* TITLE (always visible now) */}
        <Text style={styles.title}>{screenTitle}</Text>

        {/* RIGHT ICONS */}
        <View style={styles.rightRow}>
          {showFav && (
            <TouchableOpacity onPress={() => navigation.navigate("Favorites")}>
              <Text style={styles.icon}>❤️</Text>
            </TouchableOpacity>
          )}

          {showProfile && (
            <TouchableOpacity
              onPress={() => navigation.navigate("ProfileSettings")}
              style={{ marginLeft: showFav ? 16 : 0 }}
            >
              <Text style={styles.icon}>⚙️</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* SEARCH BAR (only if enabled) */}
      {showSearch && (
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Search products"
            placeholderTextColor="#999"
            value={search}
            onChangeText={onChangeSearch}
            style={styles.searchInput}
          />
          {search?.length > 0 ? (
            <TouchableOpacity onPress={() => onChangeSearch?.("")}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.searchIcon}>🔍</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  leftIcon: {
    width: 40,
    justifyContent: "center",
  },
  icon: {
    fontSize: 22,
  },
  title: {
    ...typography.title,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    flex: 1,
  },
  rightRow: {
    width: 70,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  // NEW SEARCH BAR
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginTop: 6,
    marginBottom: 6,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },
  searchIcon: {
    fontSize: 20,
    marginLeft: 8,
  },
});
