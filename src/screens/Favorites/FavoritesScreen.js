import { useMemo } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import FavoriteRow from '../../components/FavoriteRow';
import { toggleFavorite } from '../../store/slices/favoritesSlice';
import { fetchProducts } from '../../store/slices/productsSlice';
import { colors, globalStyles, layout, spacing } from '../../utils';
import AppHeader from '../../components/common/AppHeader';

export default function FavoritesScreen({ userName = 'Siddhesh' }) {
  const dispatch = useDispatch();

  const products = useSelector((s) => s.products.list);
  const status = useSelector((s) => s.products.status);

  // PURE REDUX FAVORITES LIST (no async storage)
  const favoriteIds = useSelector((s) => s.favorites.ids);

  // Load favorites from API side (if needed)
  const onRefresh = () => {
    if (status !== 'loading') dispatch(fetchProducts());
  };

  // Build final favorites list
  const favoritesList = useMemo(() => {
    if (!favoriteIds.length || !products.length) return [];
    return products.filter((p) => favoriteIds.includes(p.id));
  }, [favoriteIds, products]);

  const removeFavorite = (id) => {
    dispatch(toggleFavorite(id));
  };

  const onTapItem = (item) => {
    Alert.alert("Product", item.title);
  };

  const onLongPressItem = (item) => {
    removeFavorite(item.id);
  };

  const renderItem = ({ item }) => (
    <FavoriteRow
      item={item}
      onPress={() => onTapItem(item)}
      onLongPress={() => onLongPressItem(item)}
      onRemove={() => removeFavorite(item.id)}
    />
  );

  const ListHeader = (
    <>
      <View style={styles.countRow}>
        <Text style={styles.countText}>Total: {favoritesList.length}</Text>
      </View>
    </>
  );

  const ListEmpty = (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>No favorites yet</Text>
      <Text style={styles.emptyDesc}>
        Long press any product on the list screen to add it here.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 , backgroundColor: colors.background}} edges={['top']}>
      <AppHeader title="Home" showProfile showBack />
    <View style={styles.container}>
      <FlatList
        data={favoritesList}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={globalStyles.listContent}
        ItemSeparatorComponent={() => <View style={globalStyles.separator} />}
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

  header: { marginBottom: spacing.md },
  greet: { fontSize: 22, fontWeight: '700', color: colors.text },
  greetName: { color: colors.primary },
  subGreet: { marginTop: spacing.xs, fontSize: 13, color: colors.textMuted },

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
