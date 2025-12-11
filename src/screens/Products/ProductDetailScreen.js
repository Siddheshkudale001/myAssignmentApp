import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { fetchProducts } from '../../store/slices/productsSlice';
import { toggleFavorite } from '../../store/slices/favoritesSlice';


export default function ProductDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { id } = route.params; // productId coming from ProductList → navigate('ProductDetail', { id })

  const { list, status } = useSelector((s) => s.products);
  const favoriteIds = useSelector((s) => s.favorites.ids);

  // find product
  const product = list.find((p) => p.id === id);
  const isFav = favoriteIds.includes(id);

  // auto fetch if not loaded
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status]);

  // loading states for product load
  if (status === 'loading' || !product) {
    return (
      <View style={styles.loaderWrap}>
        <ActivityIndicator size="large" />
        <Text>Loading product...</Text>
      </View>
    );
  }

  // header → fav button + fav screen button
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          {/* Go to Favorites */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Favorites')}
            style={{ marginRight: 16 }}
          >
            <Text style={{ fontSize: 22 }}>💛</Text>
          </TouchableOpacity>

          {/* Toggle Favorite */}
          <TouchableOpacity
            onPress={() => dispatch(toggleFavorite(id))}
            style={{ marginRight: 16 }}
          >
            <Text style={{ fontSize: 22 }}>
              {isFav ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, isFav]);

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.img} />

      <Text style={styles.title}>{product.title}</Text>

      <Text style={styles.price}>${product.price}</Text>

      <Text style={styles.desc}>{product.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  img: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '500',
    color: '#333',
  },
  desc: {
    fontSize: 15,
    lineHeight: 20,
    color: '#444',
  },
  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
