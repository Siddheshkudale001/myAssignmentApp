
import { useCallback, useMemo, useState } from 'react';
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
import TextInput from '../../components/common/TextInput';

import CategoryChip from '../../components/CategoryChip';
import ProductRow from '../../components/ProductRow';

import {
  colors,
  globalStyles,
  layout,
  radius,
  spacing,
  typography,
} from '../../utils';

import { formatINR } from '../../utils/format';

// Helpers
const getCategories = (list) => {
  const set = new Set(list.map((p) => p.category));
  return ['All', ...Array.from(set)];
};
  const PRODUCTS = [
  // --- Your provided examples ---
  {
    id: 1,
    title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
    price: 109.95,
    description:
      'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday',
    category: "men's clothing",
    image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png',
    rating: { rate: 3.9, count: 120 },
  },
  {
    id: 2,
    title: 'Mens Casual Premium Slim Fit T-Shirts',
    price: 22.3,
    description:
      'Slim-fitting style, contrast raglan long sleeve, three-button henley placket, breathable and comfortable.',
    category: "men's clothing",
    image:
      'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png',
    rating: { rate: 4.1, count: 259 },
  },
  // --- Extra static items (to demonstrate pagination 3 per page) ---
  {
    id: 3,
    title: 'Solid Gold Petite Micropave',
    price: 168,
    description: 'Crafted with high-quality materials.',
    category: 'jewelery',
    image:
      'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg',
    rating: { rate: 3.9, count: 70 },
  },
  {
    id: 4,
    title: 'WD 2TB Elements Portable External Hard Drive',
    price: 64,
    description: 'USB 3.0 and USB 2.0 compatibility.',
    category: 'electronics',
    image: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg',
    rating: { rate: 4.7, count: 203 },
  },
  {
    id: 5,
    title: 'Mens Cotton Jacket',
    price: 55.99,
    description: 'Classic cotton jacket for everyday wear.',
    category: "men's clothing",
    image:
      'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg',
    rating: { rate: 4.7, count: 500 },
  },
  {
    id: 6,
    title: 'John Hardy Women’s Legends Naga Bracelet',
    price: 695,
    description: 'Stylish and elegant.',
    category: 'jewelery',
    image:
      'https://fakestoreapi.com/img/71pWzhdJNxL._AC_UY879_.jpg',
    rating: { rate: 4.6, count: 400 },
  },
  {
    id: 7,
    title: 'SanDisk SSD PLUS 1TB Internal SSD',
    price: 109,
    description: 'Boosts speed and performance.',
    category: 'electronics',
    image:
      'https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg',
    rating: { rate: 4.8, count: 980 },
  },
  {
    id: 8,
    title: 'BIYLACLESEN Women 3-in-1 Snowboard Jacket',
    price: 56.99,
    description: 'Waterproof and windproof.',
    category: "women's clothing",
    image:
      'https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg',
    rating: { rate: 4.2, count: 320 },
  },
  {
    id: 9,
    title: "Opna Women's Short Sleeve Moisture",
    price: 7.95,
    description: 'Moisture wicking fabric.',
    category: "women's clothing",
    image:
      'https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg',
    rating: { rate: 4.5, count: 146 },
  },
];

export default function ProductListScreen({ userName = 'Siddhesh' }) {
  // UI state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [favorites, setFavorites] = useState(new Set());
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Pagination
  const PAGE_SIZE = 3;
  const [page, setPage] = useState(1);


  // Derived: filtered data
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      const matchesSearch = s.length === 0 || p.title.toLowerCase().includes(s);
      const matchesCategory = category === 'All' || p.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  // Paged data shown
  const visibleData = useMemo(() => {
    return filtered.slice(0, page * PAGE_SIZE);
  }, [filtered, page]);

  const categories = useMemo(() => getCategories(PRODUCTS), []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setSearch('');
      setCategory('All');
      setPage(1);
      setRefreshing(false);
    }, 600);
  }, []);

  const onEndReached = () => {
    if (visibleData.length < filtered.length) {
      setPage((p) => p + 1);
    }
  };

  const loadMore = () => onEndReached();

  const onTapItem = (item) => {
    // Cache in recently viewed (in-memory)
    setRecentlyViewed((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      const next = existing ? prev : [item, ...prev].slice(0, 10);
      return next;
    });

    Alert.alert('Product Detail', `${item.title}\n\nPrice: ${formatINR(item.price)}`);
  };

  const onLongPressItem = (item) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) next.delete(item.id);
      else next.add(item.id);
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

  const ListHeader = (
    <>
      {/* Greeting */}
      <View style={styles.header}>
        <Text style={typography.greet}>
          Hello, <Text style={styles.greetName}>{userName}</Text> 👋
        </Text>
        <Text style={styles.subGreet}>Browse the catalog</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <TextInput
          label="Search products"
          value={search}
          onChangeText={(t) => {
            setSearch(t);
            setPage(1);
          }}
          autoCapitalize="none"
        />
      </View>

      {/* Category filters (chips) */}
      <View style={styles.chipsRow}>
        {categories.map((cat) => {
          const active = category === cat;
          return (
            <CategoryChip
              key={cat}
              label={cat}
              active={active}
              onPress={() => {
                setCategory(cat);
                setPage(1);
              }}
            />
          );
        })}
      </View>

      {/* Recently viewed */}
      {recentlyViewed.length > 0 && (
        <View style={styles.recentWrap}>
          <Text style={typography.sectionTitle}>Recently viewed</Text>
          <FlatList
            horizontal
            data={recentlyViewed}
            keyExtractor={(it) => String(it.id)}
            contentContainerStyle={styles.recentList}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.recentCard}>
                <View style={styles.recentThumbWrap}>
                  <Image source={{ uri: item.image }} style={styles.recentThumb} resizeMode="contain" />
                </View>
                <Text style={styles.recentTitle} numberOfLines={1}>{item.title}</Text>
              </View>
            )}
          />
        </View>
      )}
    </>
  );

  const ListFooter = (
    <>
      {visibleData.length < filtered.length ? (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.loadMoreBtn} onPress={loadMore} activeOpacity={0.9}>
            <Text style={styles.loadMoreText}>Load more</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.footerEnd}>
          <Text style={styles.footerEndText}>No more products</Text>
        </View>
      )}
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={visibleData}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={globalStyles.listContent}
        ItemSeparatorComponent={() => <View style={globalStyles.separator} />}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        onEndReachedThreshold={0.3}
        onEndReached={onEndReached}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const RECENT_THUMB = 60;

const styles = StyleSheet.create({
  container: { ...layout.screen },

  // Header
  header: {
    paddingHorizontal: spacing.xl,     // 16 (your original used 16)
    paddingTop: spacing['3xl'],        // 24
    paddingBottom: spacing.md,         // 8 (your original: 12; tweak if needed)
  },
  greetName: { color: colors.primary },
  subGreet: { marginTop: spacing.sm, ...typography.subtitle },

  // Search
  searchWrap: {
    paddingHorizontal: spacing.xl,     // 16
    marginBottom: spacing.xl,          // 16
  },

  // Chips
  chipsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,     // 16
    marginBottom: spacing['2xl'],      // 20
  },

  // Recently viewed section
  recentWrap: { paddingHorizontal: spacing.xl },
  recentList: {
    paddingVertical: spacing.md,       // 8
  },
  recentCard: {
    width: 140,
    marginRight: spacing.md,
  },
  recentThumbWrap: {
    width: RECENT_THUMB,
    height: RECENT_THUMB,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  recentThumb: { width: '100%', height: '100%' },
  recentTitle: { fontSize: 12, color: colors.text },

  // Footer
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  loadMoreBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    alignSelf: 'center',
  },
  loadMoreText: { color: colors.card, fontWeight: '700' },
  footerEnd: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  footerEndText: { ...typography.caption, color: colors.textMuted },
});
