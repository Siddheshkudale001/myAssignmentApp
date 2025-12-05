
// src/services/favoritesStore.js
let AsyncStorage = null;
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (e) {
  console.warn('AsyncStorage not available; falling back to in-memory favorites.');
}

const FAVORITES_KEY = '@favorites_ids';

// In-memory fallback
const memoryStore = {
  favoritesIds: [],
  async get() { return [...this.favoritesIds]; },
  async set(ids) { this.favoritesIds = [...ids]; },
  async clear() { this.favoritesIds = []; },
};

export const favoritesStore = {
  async getFavoritesIds() {
    if (AsyncStorage) {
      const raw = await AsyncStorage.getItem(FAVORITES_KEY);
      return raw ? JSON.parse(raw) : [];
    }
    return memoryStore.get();
  },
  async setFavoritesIds(ids) {
    if (AsyncStorage) {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
      return;
    }
    return memoryStore.set(ids);
  },
  async clearFavorites() {
    if (AsyncStorage) {
      await AsyncStorage.removeItem(FAVORITES_KEY);
      return;
    }
    return memoryStore.clear();
  },
};
