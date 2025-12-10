
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

import { SafeAreaView } from 'react-native-safe-area-context';

import {
  colors,
  globalStyles,
  radius,
  spacing,
  typography
} from '../../utils';

import AppHeader from '../../components/common/AppHeader';
import { formatINR } from '../../utils/format';

// helpers
const getCategories = (list) => {
  const set = new Set(list.map((p) => p.category));
  return ['All', ...Array.from(set)];
};

export default function ProductListScreen({ userName = 'Siddhesh', navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [favorites, setFavorites] = useState(new Set());
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Pagination
  const PAGE_SIZE = 4;
  const [page, setPage] = useState(1);

  // ===== FETCH PRODUCTS FROM API =====
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch('https://fakestoreapi.com/products');
      const data = await res.json();

      setProducts(data);
      setPage(1);
    } catch (e) {
      setError('Could not load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // ======== FILTER + PAGINATION ========
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchesSearch = s.length === 0 || p.title.toLowerCase().includes(s);
      const matchesCategory = category === 'All' || p.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const visibleData = useMemo(() => {
    return filtered.slice(0, page * PAGE_SIZE);
  }, [filtered, page]);

  const categories = useMemo(() => getCategories(products), [products]);

  const onEndReached = () => {
    if (visibleData.length < filtered.length) {
      setPage((p) => p + 1);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };


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
        {
          text: "Cancel",
          style: "cancel"
        }
      ]
    );
  };


  const onLongPressItem = (item) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(item.id) ? next.delete(item.id) : next.add(item.id);
      return next;
    });
  };

  const renderItem = ({ item }) => {
    const isFav = favorites.has(item.id);
    return (
      <ProductRow
        item={item}
        isFav={isFav}
        onPress={() => onTapItem(item)}
        onLongPress={() => onLongPressItem(item)}
      />
    );
  };

  // ======== HEADER ========
  const ListHeader = (
    <>
      {/* Greeting */}
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

      {/* Recently viewed */}
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
        <TouchableOpacity style={styles.loadMoreBtn} onPress={() => setPage((p) => p + 1)}>
          <Text style={styles.loadMoreText}>Load more</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.footerEnd}>No more products</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
      />
    </SafeAreaView>
  );
}

const RECENT = 60;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['3xl'],
    paddingBottom: spacing.md,
  },
  greetName: { color: colors.primary },
  subGreet: { marginTop: spacing.sm, ...typography.subtitle },

  searchWrap: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },

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
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginTop: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },

  searchIcon: {
    fontSize: 20,
    marginLeft: 8,
  },

});
