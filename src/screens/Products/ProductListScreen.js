import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import CategoryChip from '../../components/CategoryChip';
import ProductRow from '../../components/ProductRow';
import AppHeader from '../../components/common/AppHeader';

import { SafeAreaView } from 'react-native-safe-area-context';

import {
  colors,
  globalStyles,
  radius,
  spacing,
  typography
} from '../../utils';

import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite } from '../../store/slices/favoritesSlice';
import { fetchProducts } from '../../store/slices/productsSlice';

import { formatINR } from '../../utils/format';

// Helpers
const getCategories = (list) => {
  const set = new Set(list.map((p) => p.category));
  return ['All', ...Array.from(set)];
};

export default function ProductListScreen({ userName = 'Siddhesh', navigation }) {
  const dispatch = useDispatch();

  // ----- REDUX PRODUCTS -----
  // const { list: products, status, error } = useSelector((s) => s.products);
  const productState = useSelector((s) => s?.products || {});
  const products = productState.list || [];
  const status = productState.status || 'idle';
  const error = productState.error || null;
  const favoriteIds = useSelector((s) => s.favorites.ids);

  // Local UI states
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Pagination
  const PAGE_SIZE = 4;
  const [page, setPage] = useState(1);

  // Auto-fetch on first load
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  // Pull-to-refresh
  const onRefresh = () => {
    dispatch(fetchProducts());
  };

  // ==============================
  //   FIX: NO HOOKS AFTER RETURNS
  // ==============================

  if (status === 'loading') {
    return (
      <SafeAreaView style={styles.centerPage}>
        <Text style={{ fontSize: 16 }}>Loading products…</Text>
      </SafeAreaView>
    );
  }

  if (status === 'failed') {
    return (
      <SafeAreaView style={styles.centerPage}>
        <Text style={{ fontSize: 16, color: 'red' }}>
          {error || 'Error loading products'}
        </Text>
        <TouchableOpacity onPress={() => dispatch(fetchProducts())} style={{ marginTop: 20 }}>
          <Text style={{ color: colors.primary, fontWeight: '700' }}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ======== FILTERING ========
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchesSearch = s.length === 0 || p.title.toLowerCase().includes(s);
      const matchesCategory = category === 'All' || p.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  // ======== PAGINATION ========
  const visibleData = useMemo(() => {
    return filtered.slice(0, page * PAGE_SIZE);
  }, [filtered, page]);

  const categories = useMemo(() => getCategories(products), [products]);

  const onEndReached = () => {
    if (visibleData.length < filtered.length) {
      setPage((p) => p + 1);
    }
  };

  // ======== EVENTS ========
  const onTapItem = (item) => {
    // Save recently viewed
    setRecentlyViewed((prev) => {
      const exists = prev.find((p) => p.id === item.id);
      const next = exists ? prev : [item, ...prev].slice(0, 10);
      return next;
    });

    Alert.alert(
      "Product",
      `${item.title}\n\nPrice: ${formatINR(item.price)}`,
      [
        {
          text: "View Details",
          onPress: () => navigation.navigate("ProductDetail", { id: item.id })
        },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const onLongPressItem = (item) => {
    dispatch(toggleFavorite(item.id));
  };

  const renderItem = ({ item }) => {
    const isFav = favoriteIds.includes(item.id);
    return (
      <ProductRow
        item={item}
        isFav={isFav}
        onPress={() => onTapItem(item)}
        onLongPress={() => onLongPressItem(item)}
      />
    );
  };

  // ======== HEADER COMPONENT ========
  const ListHeader = (
    <>
      <View style={styles.header}>
        <Text style={typography.greet}>
          Hello, <Text style={styles.greetName}>{userName}</Text> 👋
        </Text>
        <Text style={styles.subGreet}>Browse the catalog</Text>
      </View>

      <FlatList
        horizontal
        data={categories}
        keyExtractor={(it) => it}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsContainer}
        renderItem={({ item }) => (
          <CategoryChip
            label={item}
            active={category === item}
            onPress={() => {
              setCategory(item);
              setPage(1);
            }}
          />
        )}
      />

      {recentlyViewed.length > 0 && (
        <View style={styles.recentWrap}>
          <Text style={typography.sectionTitle}>Recently viewed</Text>

          <FlatList
            horizontal
            data={recentlyViewed}
            keyExtractor={(it) => String(it.id)}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentList}
            renderItem={({ item }) => (
              <View style={styles.recentCard}>
                <View style={styles.recentThumbWrap}>
                  <Image source={{ uri: item.image }} style={styles.recentThumb} />
                </View>
                <Text numberOfLines={1} style={styles.recentTitle}>
                  {item.title}
                </Text>
              </View>
            )}
          />
        </View>
      )}
    </>
  );

  const ListFooter = (
    <View style={styles.footer}>
      {visibleData.length < filtered.length ? (
        <TouchableOpacity
          style={styles.loadMoreBtn}
          onPress={() => setPage((p) => p + 1)}
        >
          <Text style={styles.loadMoreText}>Load more</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.footerEnd}>No more products</Text>
      )}
    </View>
  );

  // ======== MAIN RENDER ========
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader
        title="Products"
        showBack
        showFav
        showSearch
        search={search}
        onChangeSearch={(t) => {
          setSearch(t);
          setPage(1);
        }}
      />

      <FlatList
        data={visibleData}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        contentContainerStyle={globalStyles.listContent}
        refreshControl={<RefreshControl refreshing={status === 'loading'} onRefresh={onRefresh} />}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
      />
    </SafeAreaView>
  );
}

const RECENT = 60;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centerPage: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['3xl'],
    paddingBottom: spacing.md,
  },
  greetName: { color: colors.primary },
  subGreet: { marginTop: spacing.sm, ...typography.subtitle },

  chipsContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },

  recentWrap: { paddingHorizontal: spacing.xl },
  recentList: { paddingVertical: spacing.md },
  recentCard: { width: 140, marginRight: spacing.md },
  recentThumbWrap: {
    width: RECENT,
    height: RECENT,
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  recentThumb: { width: '100%', height: '100%' },
  recentTitle: { fontSize: 12, color: colors.text },

  footer: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  loadMoreBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
  },
  loadMoreText: { color: 'white', fontWeight: '700' },
  footerEnd: { color: colors.textMuted, ...typography.caption },
});
