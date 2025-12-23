import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  View
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
  typography,
} from '../../utils';

import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../../store/slices/favoritesSlice';
import { fetchProducts } from '../../store/slices/productsSlice';

import { formatINR } from '../../utils/format';
import { showToast } from '../../utils/toast';

import { addFavorite, removeFavorite } from '../../core/firebase/favorites';

const PAGE_SIZE = 4;
const RECENT = 60;

export default function ProductListScreen({ navigation }) {
  const dispatch = useDispatch();

  const productState = useSelector((s) => s.products);
  const products = productState.list || [];
  const status = productState.status || 'idle';

  const favoriteIds = useSelector((s) => s.favorites.ids);
  const uid = useSelector((s) => s.auth.user?.uid);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [page, setPage] = useState(1);

  /* ---------------- fetch products ---------------- */
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const onRefresh = () => {
    dispatch(fetchProducts());
  };

  /* ---------------- filtering ---------------- */
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();

    return products.filter((p) => {
      const title = p.title?.toLowerCase?.() ?? '';
      const cat = p.category ?? '';

      return (
        (s.length === 0 || title.includes(s)) &&
        (category === 'All' || cat === category)
      );
    });
  }, [products, search, category]);

  const visibleData = useMemo(
    () => filtered.slice(0, page * PAGE_SIZE),
    [filtered, page]
  );

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [products]);

  const onEndReached = () => {
    if (visibleData.length < filtered.length) {
      setPage((p) => p + 1);
    }
  };

  /* ---------------- events ---------------- */
  const onTapItem = (item) => {
    setRecentlyViewed((prev) => {
      const exists = prev.find((p) => p.id === item.id);
      return exists ? prev : [item, ...prev].slice(0, 10);
    });

    Alert.alert(
      'Product',
      `${item.title}\n\nPrice: ${formatINR(item.price)}`,
      [
        {
          text: 'View Details',
          onPress: () =>
            navigation.navigate('ProductDetail', { id: item.id }),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const onLongPressItem = async (item) => {
    if (!uid) {
      showToast('Please login to add favorites');
      return;
    }

    const isFav = favoriteIds.includes(item.id);

    try {
      if (isFav) {
        await removeFavorite(uid, item.id);
      } else {
        await addFavorite(uid, item.id);
      }

      dispatch(toggleFavorite(item.id));

      showToast(
        isFav
          ? `${item.title} removed from favorites`
          : `${item.title} added to favorites ❤️`
      );
    } catch (e) {
      console.error('🔥 Favorite error:', e);
      showToast('Failed to update favorites');
    }
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

  /* ---------------- header (RESTORED) ---------------- */
  const ListHeader = (
    <>
      {/* Greeting */}
      <View style={styles.header}>
        <Text style={typography.greet}>
          Browse the catalog <Text style={styles.greetName}>here</Text> 👋
        </Text>
        <Text style={styles.subGreet}>
          You can search or choose categories
        </Text>
      </View>

      {/* Categories */}
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

      {/* Recently Viewed */}
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
                  <Image
                    source={{ uri: item.image }}
                    style={styles.recentThumb}
                  />
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

  /* ---------------- render ---------------- */
  return (
    <SafeAreaView style={styles.container} >
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
        contentContainerStyle={globalStyles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={status === 'loading'}
            onRefresh={onRefresh}
          />
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
      />
    </SafeAreaView>
  );
}

/* ---------------- styles ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

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
});
