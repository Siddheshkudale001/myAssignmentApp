import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../../store/slices/favoritesSlice';

import AppHeader from '../../components/common/AppHeader';
import MiniChart from '../../components/MiniChart';
import { colors, layout, radius, shadows, spacing, typography } from '../../utils';
import { formatINR } from '../../utils/format';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Helpers
const stars = (rate = 0) => {
  const filled = Math.round(rate);
  return '★'.repeat(filled) + '☆'.repeat(5 - filled);
};

// Generate random fluctuating chart trend
const generateRandomTrend = () => {
  let base = 100;
  return Array.from({ length: 12 }).map(() => {
    const change = (Math.random() * 10 - 5); // -5 to +5 range
    base = Math.max(50, base + change);
    return Math.round(base);
  });
};

export default function ProductDetailScreen({ route }) {
  const { id } = route.params;

  const dispatch = useDispatch();
  const favIds = useSelector((s) => s.favorites.ids);

  const isFav = favIds.includes(id);

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const carouselWidth = SCREEN_WIDTH;
  const imageWidth = SCREEN_WIDTH;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 });
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems?.length) {
      const idx = viewableItems[0]?.index ?? 0;
      setActiveIndex(idx);
    }
  });

  // Fetch product by ID
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`https://fakestoreapi.com/products/${id}`);
        const data = await res.json();

        const imagesArr = [data.image, data.image, data.image];

        setItem({
          ...data,
          images: imagesArr,
          priceTrend: generateRandomTrend(),
        });
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const priceText = useMemo(() => (item ? formatINR(item.price) : ''), [item]);

  const renderImage = ({ item }) => (
    <View style={[styles.imageSlide, { width: imageWidth }]}>
      <Image
        source={{ uri: item }}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );

  if (loading || !item) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <AppHeader title="Details" showBack />

      <View style={styles.container}>
        {/* Title */}
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.category}>{item.category}</Text>
        </View>

        {/* Carousel */}
        <View style={styles.carousel}>
          <FlatList
            horizontal
            data={item.images}
            renderItem={renderImage}
            keyExtractor={(uri, idx) => `${idx}-${uri}`}
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            snapToAlignment="center"
            snapToInterval={imageWidth}
            decelerationRate="fast"
            onViewableItemsChanged={onViewableItemsChanged.current}
            viewabilityConfig={viewabilityConfig.current}
            getItemLayout={(_, index) => ({
              length: imageWidth,
              offset: imageWidth * index,
              index,
            })}
          />

          <View style={styles.dotsRow}>
            {item.images.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === activeIndex && styles.dotActive]}
              />
            ))}
          </View>
        </View>

        {/* Price, Rating, Favorite Toggle */}
        <View style={styles.metaRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.price}>{priceText}</Text>
            <Text style={styles.rating}>
              {stars(item.rating?.rate)}{' '}
              <Text style={styles.ratingCount}>({item.rating?.count ?? 0})</Text>
            </Text>
          </View>

          {/* Favorite Button */}
          <TouchableOpacity
            style={[styles.favBtn, isFav && styles.favBtnActive]}
            onPress={() => dispatch(toggleFavorite(id))}
          >
            <Text style={[styles.favText, isFav && styles.favTextActive]}>
              {isFav ? '♥ Favorited' : '♡ Favorite'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={typography.sectionTitle}>Description</Text>
          <Text style={styles.descText}>{item.description}</Text>
        </View>

        {/* Price Trend Chart */}
        <View style={styles.section}>
          <Text style={typography.sectionTitle}>Price Trend</Text>
          <MiniChart data={item.priceTrend} />

          <View style={styles.chartLegend}>
            <Text style={styles.legendText}>Last 12 periods</Text>
            <Text style={styles.legendTextMuted}>
              High: {formatINR(Math.max(...item.priceTrend))} • Low:{' '}
              {formatINR(Math.min(...item.priceTrend))}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { ...layout.screen },

  header: {
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing['3xl'],
    paddingBottom: spacing.xl,
  },
  title: { fontSize: 20, fontWeight: '700', color: colors.text },
  category: { marginTop: spacing.xs, fontSize: 13, color: colors.textMuted },

  carousel: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    marginHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    ...shadows.card,
  },
  imageSlide: { height: 240, justifyContent: 'center', alignItems: 'center' },
  image: { width: SCREEN_WIDTH - spacing.xl * 2, height: 220 },

  dotsRow: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
  },
  dotActive: {
    width: 16,
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },

  metaRow: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing['2xl'],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
  },

  price: { fontSize: 20, fontWeight: '700', color: colors.text },
  rating: { marginTop: spacing.xs, fontSize: 14, color: colors.text },
  ratingCount: { fontSize: 13, color: colors.textMuted },

  favBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  favBtnActive: {
    borderColor: colors.primary,
    backgroundColor: '#E8F0FE',
  },
  favText: { color: colors.text, fontWeight: '600' },
  favTextActive: { color: colors.primary },

  section: { marginTop: spacing['2xl'], paddingHorizontal: spacing['2xl'] },
  descText: { marginTop: spacing.sm, ...typography.body, color: colors.text },

  chartLegend: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendText: { ...typography.caption, color: colors.text },
  legendTextMuted: { ...typography.caption, color: colors.textMuted },
});
