import { useMemo } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import AppHeader from '../../components/common/AppHeader';
import FavoriteRow from '../../components/FavoriteRow';
import { toggleFavorite } from '../../store/slices/favoritesSlice';
import { fetchProducts } from '../../store/slices/productsSlice';
import { colors, globalStyles, layout, spacing } from '../../utils';

// 🔥 NEW
import { removeFavorite as removeFavoriteFromDB } from '../../core/firebase/favorites';

export default function FavoritesScreen({ navigation }) {
  const dispatch = useDispatch();

  const products = useSelector((s) => s.products.list);
  const status = useSelector((s) => s.products.status);
  const favoriteIds = useSelector((s) => s.favorites.ids);

  // 🔥 NEW
  // const uid = useSelector((s) => s.auth?.uid);
  const uid = useSelector((s) => s.auth.user?.uid);

  const onRefresh = () => {
    if (status !== 'loading') dispatch(fetchProducts());
  };

  const favoritesList = useMemo(() => {
    if (!favoriteIds.length || !products.length) return [];
    return products.filter((p) => favoriteIds.includes(p.id));
  }, [favoriteIds, products]);

  // 🔥 UPDATED (SYNC DB + REDUX)
  const removeFavorite = async (id) => {
    if (!uid) return;

    try {
      await removeFavoriteFromDB(uid, id);
      dispatch(toggleFavorite(id));
    } catch (e) {
      console.error('🔥 remove favorite error', e);
    }
  };

  const onTapItem = (item) => {
    Alert.alert('Product', item.title);
  };

  const renderItem = ({ item }) => (
    <FavoriteRow
      item={item}
      onPress={() => onTapItem(item)}
      onLongPress={() => removeFavorite(item.id)}
      onRemove={() => removeFavorite(item.id)}
    />
  );

  const ListHeader = (
    <View style={styles.countRow}>
      <Text style={styles.countText}>Total: {favoritesList.length}</Text>
    </View>
  );

  // 🔥 AUTH-AWARE EMPTY STATE
  const ListEmpty = (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>
        {uid ? 'No favorites yet' : 'Please login'}
      </Text>
      <Text style={styles.emptyDesc}>
        {uid
          ? 'Long press any product to add it here.'
          : 'Login to see your favorite products.'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={['top']}
    >
      <AppHeader title="Favorites" showBack />
      <View style={styles.container}>
        <FlatList
          data={favoritesList}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={globalStyles.listContent}
          ItemSeparatorComponent={() => (
            <View style={globalStyles.separator} />
          )}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={ListEmpty}
          refreshControl={
            <RefreshControl
              refreshing={status === 'loading'}
              onRefresh={onRefresh}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { ...layout.screen },

  countRow: { marginBottom: spacing.md },
  countText: { fontSize: 13, color: colors.textMuted },

  empty: {
    marginTop: spacing['2xl'],
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  emptyDesc: {
    marginTop: spacing.sm,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
