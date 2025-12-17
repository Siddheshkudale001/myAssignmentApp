// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { configureStore } from '@reduxjs/toolkit';
// import {
//   FLUSH, PAUSE,
//   PERSIST, persistReducer, persistStore, PURGE,
//   REGISTER, REHYDRATE
// } from 'redux-persist';

// // slices
// import favoritesReducer from './slices/favoritesSlice';
// import productsReducer from './slices/productsSlice';

// // persist config ONLY for favorites
// const favoritesPersistConfig = {
//   key: 'favorites',
//   storage: AsyncStorage,
//   whitelist: ['ids'], // persist only IDs, not whole product data
// };

// const persistedFavorites = persistReducer(
//   favoritesPersistConfig,
//   favoritesReducer
// );

// export const store = configureStore({
//   reducer: {
//     favorites: persistedFavorites,
//     products: productsReducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [
//           FLUSH,
//           REHYDRATE,
//           PAUSE,
//           PERSIST,
//           PURGE,
//           REGISTER,
//         ],
//       },
//     }),
// });

// export const persistor = persistStore(store);
import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';

// slices
import favoritesReducer from './slices/favoritesSlice';
import productsReducer from './slices/productsSlice';
import authReducer from './slices/authSlice'; // ✅ ADD THIS

/* ---------------- Persist config ---------------- */

// persist ONLY favorites
const favoritesPersistConfig = {
  key: 'favorites',
  storage: AsyncStorage,
  whitelist: ['ids'],
};

const persistedFavorites = persistReducer(
  favoritesPersistConfig,
  favoritesReducer
);

/* ---------------- Store ---------------- */

export const store = configureStore({
  reducer: {
    auth: authReducer,              // ✅ REQUIRED
    favorites: persistedFavorites,  // ✅ persisted
    products: productsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
    }),
});

export const persistor = persistStore(store);
