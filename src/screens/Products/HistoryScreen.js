import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

import { SafeAreaView } from 'react-native-safe-area-context';
import ProductRow from '../../components/ProductRow';

import {
  clearHistory,
  subscribeToHistory,
} from '../../core/firebase/history';

import AppHeader from '../../components/common/AppHeader';
import { colors, spacing, typography } from '../../utils';

/* ---------------- TIME AGO HELPER ---------------- */
const timeAgo = (timestamp) => {
  if (!timestamp?.seconds) return '';

  const diffMs = Date.now() - timestamp.seconds * 1000;
  const mins = Math.floor(diffMs / 60000);

  if (mins < 1) return 'Just now';
  if (mins < 60) return `Viewed ${mins} min ago`;

  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Viewed ${hrs} hr ago`;

  const days = Math.floor(hrs / 24);
  return `Viewed ${days} day ago`;
};

export default function HistoryScreen() {
  const uid = useSelector((s) => s.auth.user?.uid);

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- REAL-TIME SUBSCRIBE ---------------- */
  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToHistory(uid, (data) => {
      setHistory(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [uid]);

  /* ---------------- CLEAR HANDLER ---------------- */
  const onClearHistory = async () => {
    await clearHistory(uid);
  };

  /* ---------------- STATES ---------------- */
  if (!uid) {
    return (
      <View style={styles.empty}>
        <Text style={typography.sectionTitle}>Login required 🔐</Text>
        <Text style={styles.sub}>Sign in to see your history</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.empty}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (history.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={typography.sectionTitle}>No history yet 👀</Text>
        <Text style={styles.sub}>View some products first</Text>
      </View>
    );
  }

  /* ---------------- LIST ---------------- */
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} >
      <AppHeader title="History" showBack />
      <TouchableOpacity
        style={styles.clearBtn}
        onPress={onClearHistory}
      >
        <Text style={styles.clearText}>🧹 Clear history</Text>
      </TouchableOpacity>

      <FlatList
        data={history}
        keyExtractor={(item) => String(item.productId)}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        renderItem={({ item }) => (
          <View>
            <ProductRow item={item} />
            <Text style={styles.time}>
              {timeAgo(item.viewedAt)}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  sub: {
    marginTop: spacing.sm,
    color: colors.textMuted,
    textAlign: 'center',
  },
  clearBtn: {
    alignSelf: 'flex-end',
    margin: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.card,
  },
  clearText: {
    color: colors.primary,
    fontWeight: '600',
  },
  time: {
    marginLeft: spacing.xl,
    marginBottom: spacing.sm,
    color: colors.textMuted,
    fontSize: 12,
  },
});
