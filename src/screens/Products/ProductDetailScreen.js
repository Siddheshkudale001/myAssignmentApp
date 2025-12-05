
// import React, { useMemo, useRef, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   Dimensions,
// } from 'react-native';

// const { width: SCREEN_WIDTH } = Dimensions.get('window');

// // ---- Static product (images, description, rating, price, trend) ----
// const PRODUCT = {
//   id: 1,
//   title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
//   price: 109.95,
//   description:
//     'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve. Durable, comfortable, and versatile.',
//   category: "men's clothing",
//   images: [
//     // Using same image in multiple frames for demo; replace with your own static URIs/local assets if you want.
//     'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
//     'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
//     'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
//   ],
//   rating: { rate: 3.9, count: 120 },
//   priceTrend: [95, 99, 103, 100, 108, 110, 112, 109, 111, 115, 118, 120], // static
// };

// // Helpers
// const formatINR = (value) => {
//   try {
//     return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
//   } catch {
//     return `₹${Number(value).toFixed(2)}`;
//   }
// };
// const stars = (rate) => {
//   const filled = Math.round(rate);
//   return '★'.repeat(filled) + '☆'.repeat(Math.max(0, 5 - filled));
// };

// // Minimal inline chart (bars) — no external libraries
// const MiniChart = ({ data = [], height = 60, barWidth = 10, gap = 6 }) => {
//   if (!data.length) return null;
//   const max = Math.max(...data);
//   const min = Math.min(...data);
//   const range = Math.max(1, max - min);
//   return (
//     <View style={[styles.chartWrap, { height }]}>
//       {data.map((v, i) => {
//         const normalized = (v - min) / range;
//         const barH = Math.max(6, Math.round(normalized * (height - 10)));
//         return (
//           <View
//             key={i}
//             style={{
//               width: barWidth,
//               height: barH,
//               backgroundColor: COLORS.primary,
//               borderRadius: 4,
//               marginRight: gap,
//               alignSelf: 'flex-end',
//             }}
//           />
//         );
//       })}
//     </View>
//   );
// };

// export default function ProductDetailScreen() {
//   const [isFav, setIsFav] = useState(false);
//   const [cartQty, setCartQty] = useState(0);
//   const [activeIndex, setActiveIndex] = useState(0);

//   const carouselWidth = SCREEN_WIDTH;
//   const imageWidth = SCREEN_WIDTH;
//   const viewabilityConfig = useRef({
//     itemVisiblePercentThreshold: 60,
//   });

//   const onViewableItemsChanged = useRef(({ viewableItems }) => {
//     if (viewableItems?.length) {
//       const idx = viewableItems[0]?.index ?? 0;
//       setActiveIndex(idx);
//     }
//   });

//   const priceText = useMemo(() => formatINR(PRODUCT.price), []);

//   const handleAddToCart = () => setCartQty((q) => q + 1);
//   const handleToggleFav = () => setIsFav((f) => !f);

//   const renderImage = ({ item }) => (
//     <View style={[styles.imageSlide, { width: imageWidth }]}>
//       <Image
//         source={{ uri: item }}
//         style={styles.image}
//         resizeMode="contain"
//         onError={() => {}}
//       />
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Title */}
//       <View style={styles.header}>
//         <Text style={styles.title} numberOfLines={2}>{PRODUCT.title}</Text>
//         <Text style={styles.category}>{PRODUCT.category}</Text>
//       </View>

//       {/* Carousel */}
//       <View style={styles.carousel}>
//         <FlatList
//           horizontal
//           data={PRODUCT.images}
//           renderItem={renderImage}
//           keyExtractor={(uri, idx) => `${idx}-${uri}`}
//           showsHorizontalScrollIndicator={false}
//           pagingEnabled
//           snapToAlignment="center"
//           snapToInterval={imageWidth}
//           decelerationRate="fast"
//           onViewableItemsChanged={onViewableItemsChanged.current}
//           viewabilityConfig={viewabilityConfig.current}
//           getItemLayout={(_, index) => ({
//             length: imageWidth,
//             offset: imageWidth * index,
//             index,
//           })}
//         />
//         {/* Dots */}
//         <View style={styles.dotsRow}>
//           {PRODUCT.images.map((_, i) => (
//             <View
//               key={i}
//               style={[styles.dot, i === activeIndex && styles.dotActive]}
//             />
//           ))}
//         </View>
//       </View>

//       {/* Price, Rating & Actions */}
//       <View style={styles.metaRow}>
//         <View style={{ flex: 1 }}>
//           <Text style={styles.price}>{priceText}</Text>
//           <Text style={styles.rating}>
//             {stars(PRODUCT.rating?.rate ?? 0)}{' '}
//             <Text style={styles.ratingCount}>({PRODUCT.rating?.count ?? 0})</Text>
//           </Text>
//         </View>

//         <View style={styles.actions}>
//           <TouchableOpacity
//             style={[styles.favBtn, isFav && styles.favBtnActive]}
//             onPress={handleToggleFav}
//             activeOpacity={0.85}
//           >
//             <Text style={[styles.favText, isFav && styles.favTextActive]}>
//               {isFav ? '♥ Favorited' : '♡ Favorite'}
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.cartBtn}
//             onPress={handleAddToCart}
//             activeOpacity={0.85}
//           >
//             <Text style={styles.cartText}>Add to Cart</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Description */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Description</Text>
//         <Text style={styles.descText}>{PRODUCT.description}</Text>
//       </View>

//       {/* Price Trend (mini chart) */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Price Trend</Text>
//         <MiniChart data={PRODUCT.priceTrend} />
//         <View style={styles.chartLegend}>
//           <Text style={styles.legendText}>Last 12 periods</Text>
//           <Text style={styles.legendTextMuted}>
//             High: {formatINR(Math.max(...PRODUCT.priceTrend))} •
//             Low: {formatINR(Math.min(...PRODUCT.priceTrend))}
//           </Text>
//         </View>
//       </View>

//       {/* Cart summary (mock) */}
//       <View style={styles.cartSummary}>
//         <Text style={styles.cartSummaryText}>
//           Cart items added: <Text style={{ fontWeight: '700' }}>{cartQty}</Text>
//         </Text>
//       </View>
//     </View>
//   );
// }

// // --- Styles & Colors ---
// const COLORS = {
//   background: '#F5F7FB',
//   card: '#FFFFFF',
//   text: '#111827',
//   textMuted: '#6B7280',
//   primary: '#3B82F6',
//   border: '#E5E7EB',
//   shadow: '#000',
//   danger: '#EF4444',
//   success: '#16A34A',
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },

//   header: {
//     paddingHorizontal: 20,
//     paddingTop: 24,
//     paddingBottom: 12,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: COLORS.text,
//   },
//   category: {
//     marginTop: 4,
//     fontSize: 13,
//     color: COLORS.textMuted,
//   },

//   carousel: {
//     backgroundColor: COLORS.card,
//     borderRadius: 14,
//     marginHorizontal: 16,
//     paddingVertical: 8,
//     // subtle shadow/elevation
//     shadowColor: COLORS.shadow,
//     shadowOpacity: 0.06,
//     shadowRadius: 10,
//     shadowOffset: { width: 0, height: 3 },
//     elevation: 2,
//   },
//   imageSlide: {
//     height: 240,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   image: {
//     width: SCREEN_WIDTH - 32,
//     height: 220,
//   },
//   dotsRow: {
//     marginTop: 6,
//     marginBottom: 8,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 6,
//   },
//   dot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#D1D5DB',
//   },
//   dotActive: {
//     backgroundColor: COLORS.primary,
//   },

//   metaRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingTop: 12,
//     gap: 12,
//   },
//   price: {
//     fontSize: 22,
//     fontWeight: '800',
//     color: COLORS.text,
//   },
//   rating: {
//     marginTop: 6,
//     fontSize: 13,
//     color: COLORS.textMuted,
//     fontWeight: '600',
//   },
//   ratingCount: {
//     color: COLORS.textMuted,
//     fontWeight: '400',
//   },

//   actions: {
//     flexDirection: 'row',
//     gap: 8,
//   },
//   favBtn: {
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderRadius: 10,
//     backgroundColor: '#F0F4F8',
//     borderWidth: 1,
//     borderColor: '#E6EDF5',
//   },
//   favBtnActive: {
//     backgroundColor: '#FFF0F5',
//     borderColor: '#FFD3E2',
//   },
//   favText: {
//     color: COLORS.text,
//     fontWeight: '600',
//     fontSize: 13,
//   },
//   favTextActive: {
//     color: '#E11D48',
//   },
//   cartBtn: {
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderRadius: 10,
//     backgroundColor: COLORS.primary,
//   },
//   cartText: {
//     color: '#FFF',
//     fontWeight: '700',
//     fontSize: 13,
//   },

//   section: {
//     marginTop: 14,
//     paddingHorizontal: 20,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: COLORS.text,
//     marginBottom: 8,
//   },
//   descText: {
//     fontSize: 14,
//     color: COLORS.textMuted,
//     lineHeight: 20,
//   },

//   chartWrap: {
//     marginTop: 6,
//     backgroundColor: COLORS.card,
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     // subtle shadow/elevation
//     shadowColor: COLORS.shadow,
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 3 },
//     elevation: 2,

//     flexDirection: 'row',
//     alignItems: 'flex-end',
//   },
//   chartLegend: {
//     marginTop: 6,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   legendText: {
//     fontSize: 12.5,
//     color: COLORS.text,
//   },
//   legendTextMuted: {
//     fontSize: 12.5,
//     color: COLORS.textMuted,
//   },

//   cartSummary: {
//     marginTop: 16,
//     paddingHorizontal: 20,
//     paddingBottom: 24,
//   },
//   cartSummaryText: {
//     fontSize: 13.5,
//     color: COLORS.textMuted,
//   },
// });

import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import MiniChart from '../../components/MiniChart';
import { colors, spacing, radius, shadows, layout, typography } from '../../utils';
import { formatINR } from '../../utils/format'; // reuse formatter we created earlier

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ---- Static product ----
const PRODUCT = {
  id: 1,
  title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
  price: 109.95,
  description:
    'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve. Durable, comfortable, and versatile.',
  category: "men's clothing",
  images: [
    'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
  ],
  rating: { rate: 3.9, count: 120 },
  priceTrend: [95, 99, 103, 100, 108, 110, 112, 109, 111, 115, 118, 120],
};

// Helpers
const stars = (rate) => {
  const filled = Math.round(rate);
  return '★'.repeat(filled) + '☆'.repeat(Math.max(0, 5 - filled));
};

export default function ProductDetailScreen() {
  const [isFav, setIsFav] = useState(false);
  const [cartQty, setCartQty] = useState(0);
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

  const priceText = useMemo(() => formatINR(PRODUCT.price), []);

  const handleAddToCart = () => setCartQty((q) => q + 1);
  const handleToggleFav = () => setIsFav((f) => !f);

  const renderImage = ({ item }) => (
    <View style={[styles.imageSlide, { width: imageWidth }]}>
      <Image source={{ uri: item }} style={styles.image} resizeMode="contain" onError={() => {}} />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Title */}
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>{PRODUCT.title}</Text>
        <Text style={styles.category}>{PRODUCT.category}</Text>
      </View>

      {/* Carousel */}
      <View style={styles.carousel}>
        <FlatList
          horizontal
          data={PRODUCT.images}
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
        {/* Dots */}
        <View style={styles.dotsRow}>
          {PRODUCT.images.map((_, i) => (
            <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
          ))}
        </View>
      </View>

      {/* Price, Rating & Actions */}
      <View style={styles.metaRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.price}>{priceText}</Text>
          <Text style={styles.rating}>
            {stars(PRODUCT.rating?.rate ?? 0)}{' '}
            <Text style={styles.ratingCount}>({PRODUCT.rating?.count ?? 0})</Text>
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.favBtn, isFav && styles.favBtnActive]}
            onPress={handleToggleFav}
            activeOpacity={0.85}
          >
            <Text style={[styles.favText, isFav && styles.favTextActive]}>
              {isFav ? '♥ Favorited' : '♡ Favorite'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart} activeOpacity={0.85}>
            <Text style={styles.cartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={typography.sectionTitle}>Description</Text>
        <Text style={styles.descText}>{PRODUCT.description}</Text>
      </View>

      {/* Price Trend */}
      <View style={styles.section}>
        <Text style={typography.sectionTitle}>Price Trend</Text>
        <MiniChart data={PRODUCT.priceTrend} />
        <View style={styles.chartLegend}>
          <Text style={styles.legendText}>Last 12 periods</Text>
          <Text style={styles.legendTextMuted}>
            High: {formatINR(Math.max(...PRODUCT.priceTrend))} • Low: {formatINR(Math.min(...PRODUCT.priceTrend))}
          </Text>
        </View>
      </View>

      {/* Cart summary (mock) */}
      <View style={styles.cartSummary}>
        <Text style={styles.cartSummaryText}>
          Cart items added: <Text style={{ fontWeight: '700' }}>{cartQty}</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...layout.screen,
  },

  header: {
    paddingHorizontal: spacing['2xl'], // 20
    paddingTop: spacing['3xl'],        // 24
    paddingBottom: spacing.xl,         // 16 (your original had 12; adjust here if needed)
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  category: {
    marginTop: spacing.xs,             // 4
    fontSize: 13,
    color: colors.textMuted,
  },

  carousel: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,           // 14
    marginHorizontal: spacing.xl,      // 16
    paddingVertical: spacing.md,       // 8
    ...shadows.card,
  },
  imageSlide: {
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SCREEN_WIDTH - spacing.xl * 2, // SCREEN_WIDTH - 32
    height: 220,
  },

  // Dots
  dotsRow: {
    marginTop: spacing.sm,             // 6
    marginBottom: spacing.md,          // 8
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,                   // 6 (RN >= 0.71)
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

  // Meta row
  metaRow: {
    marginTop: spacing.xl,             // 16
    paddingHorizontal: spacing['2xl'], // 20
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,                   // 16
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  rating: {
    marginTop: spacing.xs,             // 4
    fontSize: 14,
    color: colors.text,
  },
  ratingCount: {
    fontSize: 13,
    color: colors.textMuted,
  },

  // Actions (Favorite & Add to Cart)
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,                   // 8
  },
  favBtn: {
    paddingHorizontal: spacing.lg,     // 12
    paddingVertical: spacing.sm,       // 6
    borderRadius: radius.md,           // 10
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  favBtnActive: {
    borderColor: colors.primary,
    backgroundColor: '#E8F0FE',       // light primary tint for active
  },
  favText: {
    color: colors.text,
    fontWeight: '600',
  },
  favTextActive: {
    color: colors.primary,
  },
  cartBtn: {
    paddingHorizontal: spacing.xl,     // 16
    paddingVertical: spacing.sm,       // 6
    borderRadius: radius.md,           // 10
    backgroundColor: colors.primary,
  },
  cartText: {
    color: colors.card,
    fontWeight: '700',
  },

  // Section blocks
  section: {
    marginTop: spacing['2xl'],         // 20
    paddingHorizontal: spacing['2xl'], // 20
  },
  descText: {
    marginTop: spacing.sm,             // 6
    ...typography.body,
    color: colors.text,
  },

  // Chart legend
  chartLegend: {
    marginTop: spacing.sm,             // 6
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendText: {
    ...typography.caption,
    color: colors.text,
  },
  legendTextMuted: {
    ...typography.caption,
    color: colors.textMuted,
  },

  // Cart summary
  cartSummary: {
    marginTop: spacing['2xl'],         // 20
    marginHorizontal: spacing.xl,      // 16
    padding: spacing.xl,               // 16
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cartSummaryText: {
    ...typography.body,
  },
});
