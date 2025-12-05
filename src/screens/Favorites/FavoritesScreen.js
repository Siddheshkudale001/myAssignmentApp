
// screens/Products/FavoritesScreen.js
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';

import FavoriteRow from '../../components/FavoriteRow';
import { colors, spacing, layout, typography, globalStyles, radius } from '../../utils';
import { favoritesStore as store } from '../../services/favoritesStore'; // or keep inline store from your current file

// Static product catalog (same data shape as previous screens)
// Prefer centralizing: src/data/products.js
// import { PRODUCTS } from '../../data/products';
const PRODUCTS = [
  {
    id: 1,
    title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
    price: 109.95,
    category: "men's clothing",
    image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png',
    rating: { rate: 3.9, count: 120 },
  },
  {
    id: 2,
    title: 'Mens Casual Premium Slim Fit T-Shirts',
    price: 22.3,
    category: "men's clothing",
    image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png',
    rating: { rate: 4.1, count: 259 },
  },
  {
    id: 3,
    title: 'Solid Gold Petite Micropave',
    price: 168,
    category: 'jewelery',
    image: 'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg',
    rating: { rate: 3.9, count: 70 },
  },
  {
    id: 4,
    title: 'WD 2TB Elements Portable External Hard Drive',
    price: 64,
    category: 'electronics',
    image: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg',
    rating: { rate: 4.7, count: 203 },
  },
  {
    id: 5,
    title: 'Mens Cotton Jacket',
    price: 55.99,
    category: "men's clothing",
    image: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg',
    rating: { rate: 4.7, count: 500 },
  },
  {
    id: 6,
    title: 'John Hardy Women’s Legends Naga Bracelet',
    price: 695,
    category: 'jewelery',
    image: 'https://fakestoreapi.com/img/71pWzhdJNxL._AC_UY879_.jpg',
    rating: { rate: 4.6, count: 400 },
  },
];

export default function FavoritesScreen({ userName = 'Siddhesh' }) {
  const [favoritesIds, setFavoritesIds] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const addSampleFavorites = async () => {
    const sample = [1, 4, 6]; // pick any IDs from PRODUCTS
    setFavoritesIds(sample);
    await store.setFavoritesIds(sample);
  };

  const clearAllFavorites = async () => {
    setFavoritesIds([]);
    await store.clearFavorites();
  };

  const loadFavorites = async () => {
    const ids = await store.getFavoritesIds();
    setFavoritesIds(ids);
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const favoritesList = useMemo(() => {
    if (!favoritesIds?.length) return [];
    const map = new Map(PRODUCTS.map((p) => [p.id, p]));
    return favoritesIds.map((id) => map.get(id)).filter(Boolean);
  }, [favoritesIds]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  const removeFavorite = async (id) => {
    const next = favoritesIds.filter((fid) => fid !== id);
    setFavoritesIds(next);
    await store.setFavoritesIds(next);
  };

  const onTapItem = (item) => {
    Alert.alert('Product', item.title);
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
      {/* Greeting / Header */}
      <View style={styles.header}>
        <Text style={styles.greet}>
          Favorites of <Text style={styles.greetName}>{userName}</Text> ❤️
        </Text>
        <Text style={styles.subGreet}>Saved items for quick access</Text>
      </View>

      {/* Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={addSampleFavorites} activeOpacity={0.9}>
          <Text style={styles.actionText}>Add Sample Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.actionBtnSecondary]}
          onPress={clearAllFavorites}
          activeOpacity={0.9}
        >
          <Text style={[styles.actionText, styles.actionTextSecondary]}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* Count */}
      <View style={styles.countRow}>
        <Text style={styles.countText}>Total: {favoritesList.length}</Text>
      </View>
    </>
  );

  const ListEmpty = (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>No favorites yet</Text>
      <Text style={styles.emptyDesc}>
        Long press a product on the list screen to add it here. For demo, use “Add Sample Favorites”.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={favoritesList}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={globalStyles.listContent}
        ItemSeparatorComponent={() => <View style={globalStyles.separator} />}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...layout.screen },

  // Header
  header: {
    marginBottom: spacing.md,           // 8
  },
  greet: { fontSize: 22, fontWeight: '700', color: colors.text },
  greetName: { color: colors.primary },
  subGreet: { marginTop: spacing.xs, fontSize: 13, color: colors.textMuted },

  // Actions
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.md,                    // 8 (RN >= 0.71)
    marginTop: spacing.md,              // 8~10 (your original: 10)
    marginBottom: spacing.sm,           // 6
  },
  actionBtn: {
    paddingHorizontal: spacing.lg,      // 12
    paddingVertical: spacing.md,        // 8 (your original: 10; tweak if exact)
    borderRadius: radius.md,            // 10
    backgroundColor: colors.primary,
  },
  actionText: { color: colors.card, fontWeight: '700', fontSize: 13 },
  actionBtnSecondary: {
    backgroundColor: '#F0F4F8',
    borderWidth: 1,
    borderColor: '#E6EDF5',
  },
  actionTextSecondary: { color: colors.text },

  // Count
  countRow: { marginBottom: spacing.md }, // 8
  countText: { fontSize: 13, color: colors.textMuted },

  // Empty state
  empty: {
    marginTop: spacing['2xl'],          // 20
    paddingHorizontal: spacing.xl,      // 16
    alignItems: 'center',
  },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  emptyDesc: {
    marginTop: spacing.sm,              // 6
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
