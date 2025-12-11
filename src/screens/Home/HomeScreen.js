import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../components/common/AppHeader';
import ProductCard from '../../components/ProductCard';
import { colors, spacing } from '../../utils';
import { formatINR } from '../../utils/format';

export default function HomeScreen({ navigation }) {
  const userName = 'Siddhesh';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const listRef = useRef(null);
  const scrollIndex = useRef(0);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://fakestoreapi.com/products');
      const data = await res.json();
      setProducts(data);
    } catch (e) {
      console.log('Fetch Error:', e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Auto Scroll
  useEffect(() => {
    if (products.length === 0) return;
    const interval = setInterval(() => {
      scrollIndex.current = (scrollIndex.current + 1) % products.length;
      listRef.current?.scrollToIndex({
        index: scrollIndex.current,
        animated: true,
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [products]);

  const onCardPress = (item) => {
    Alert.alert('Product', item.title);
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productWrapper}>
      <ProductCard
        image={item.image}
        title={item.title}
        price={formatINR(item.price)}
        onPress={() => onCardPress(item)}
      />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>

      <AppHeader title="Home" showProfile />

      <View style={styles.container}>

        {/* Greeting Section */}
        <View style={styles.header}>
          <Text style={styles.greet}>
            Hey <Text style={styles.greetName}>{userName}</Text> 👋
          </Text>
          <Text style={styles.subGreet}>Check out these new arrivals</Text>

        </View>
        {/* Banner */}
        <View style={styles.bannerWrapper}>
          <Image
            source={require('../../assets/banner.jpg')}  // put your downloaded image here
            style={styles.banner}
            resizeMode="cover"
          />
        </View>
        {/* Virat Ads */}
        <View style={styles.adBox}>
          <Image
            source={require('../../assets/Virat.jpg')}
            style={styles.adImage}
            resizeMode="cover"
          />
        </View>



        {/* Section Title */}
        <Text style={styles.sectionTitle}>Trending Products</Text>


        {loading && <ActivityIndicator size="large" style={{ marginTop: 40 }} />}

        {!loading && !error && (
          <FlatList
            ref={listRef}
            horizontal
            data={products}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderProduct}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            getItemLayout={(data, index) => ({
              length: 240,
              offset: 240 * index,
              index,
            })}
          />
        )}

        {/* Modern FAB */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("ProductList")}
        >
          <Text style={styles.fabIcon}>🗂️</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing['2xl'],
    paddingBottom: spacing.lg,
  },
  greet: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
  },
  greetName: {
    color: colors.primary,
  },
  subGreet: {
    marginTop: 6,
    color: '#666',
    fontSize: 15,
  },

  // Search Material Style
  searchBox: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    backgroundColor: '#f1f3f4',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#222',
  },
  searchIcon: {
    fontSize: 18,
  },

  // Section title
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    paddingHorizontal: spacing['2xl'],
    marginTop: spacing.md,
  },

  listContent: {
    paddingVertical: spacing.xl,
  },

  productWrapper: {
    marginLeft: spacing['2xl'],
  },

  // FAB
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 36,
    backgroundColor: colors.primary,
    height: 60,
    width: 60,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  fabIcon: {
    fontSize: 26,
    color: 'white',
  },
  bannerWrapper: {
    width: '100%',
    paddingHorizontal: spacing['2xl'],
    marginTop: 10,
  },
  banner: {
    width: '100%',
    height: 150,
    borderRadius: 16,
    backgroundColor: '#ddd',
  },

  adBox: {
    width: '100%',
    paddingHorizontal: spacing['2xl'],
    marginTop: 16,
  },
  adImage: {
    width: '100%',
    height: 120,
    borderRadius: 14,
    backgroundColor: '#eee',
  },

});
