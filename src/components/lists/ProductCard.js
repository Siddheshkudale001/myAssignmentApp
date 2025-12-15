
// src/screens/Home/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import ProductCard from '../../components/lists/ProductCard';

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  const url = 'https://fakestoreapi.com/products';

  useEffect(() => {
    const onPageLoad = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(url);
        setProducts(res.data || []);
      } catch (e) {
        setError(e);
        Alert.alert('Error', 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    onPageLoad();
  }, []); // runs once on mount

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hello, Guest</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#1976D2" style={{ marginTop: 24 }} />
      ) : error ? (
        <Text style={styles.error}>Couldn’t load products.</Text>
      ) : (
        <FlatList
          horizontal
          data={products}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.productList}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <ProductCard
              item={item}
              onPress={(p) => navigation.navigate('ProductDetail', { id: p.id })}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingVertical: 12, backgroundColor: '#fff' },
  greeting: { fontSize: 18, fontWeight: '700', marginHorizontal: 16, marginBottom: 8 },
  productList: { paddingHorizontal: 16, paddingBottom: 8 },
  error: { color: '#E53935', marginHorizontal: 16, marginTop: 12 },
})