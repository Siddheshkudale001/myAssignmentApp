// screens/Home/HomeScreen.js
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import Button from '../../components/common/Button';
import ProductCard from '../../components/ProductCard';
import { colors, layout, spacing, typography } from '../../utils';
import { formatINR } from '../../utils/format';

// ---- Static data ----
const PRODUCTS = [
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
    title: 'Mens Casual Premium Slim Fit T-Shirts ',
    price: 22.3,
    description:
      'Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing.',
    category: "men's clothing",
    image:
      'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png',
    rating: { rate: 4.1, count: 259 },
  },
  {
    id: 3,
    title: 'Solid Gold Petite Micropave',
    price: 168,
    description:
      'Satisfaction guaranteed. Crafted with high-quality materials.',
    category: 'jewelery',
    image: 'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg',
    rating: { rate: 3.9, count: 70 },
  },
  {
    id: 4,
    title: 'WD 2TB Elements Portable External Hard Drive',
    price: 64,
    description:
      'USB 3.0 and USB 2.0 compatibility. Reliable and fast storage.',
    category: 'electronics',
    image: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg',
    rating: { rate: 4.7, count: 203 },
  },
];

export default function HomeScreen({ navigation }) {
  var userName = 'Siddhesh';
  const onCardPress = item => {
    Alert.alert('Product', item.title);
  };

  const renderProduct = ({ item }) => (
    <ProductCard
      image={item.image}
      title={item.title}
      price={formatINR(item.price)}
      onPress={() => onCardPress(item)}
    />
  );

  const onClickProductBtn = () => {
    navigation.navigate('ProductList');
  };

  return (
    <View style={styles.container}>
      {/* Greeting */}
      <View style={styles.header}>
        <Text style={typography.greet}>
          Hello, <Text style={styles.greetName}>{userName}</Text> 👋
        </Text>
        <Text style={styles.subGreet}>Here are today’s picks for you</Text>
      </View>

      {/* Section title */}
      <View style={styles.sectionHeader}>
        <Text style={typography.sectionTitle}>Products</Text>
      </View>

      {/* Horizontal Carousel */}
      <FlatList
        horizontal
        data={PRODUCTS}
        keyExtractor={item => String(item.id)}
        renderItem={renderProduct}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
      <Button
        title={'ProductList'}
        onPress={onClickProductBtn}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...layout.screen,
    paddingTop: spacing['3xl'], // 24
  },

  // Greeting
  header: {
    paddingHorizontal: spacing['2xl'], // 20
    marginBottom: spacing.md, // 8
  },
  greetName: {
    color: colors.primary,
  },
  subGreet: {
    marginTop: spacing.sm, // 6
    ...typography.subtitle,
  },

  // Section header
  sectionHeader: {
    marginTop: spacing.xl, // 16
    paddingHorizontal: spacing['2xl'], // 20
  },

  // List content paddings
  listContent: {
    paddingHorizontal: spacing['2xl'], // 20
    paddingVertical: spacing.xl, // 16
  },
});
