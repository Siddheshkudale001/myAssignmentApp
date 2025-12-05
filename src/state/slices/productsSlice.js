
// src/state/slices/productsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProducts } from '../../services/productsService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../storage/keys';

export const fetchProducts = createAsyncThunk(
  'products/fetch',
  async ({ page = 1, limit = 20 }) => {
    const data = await getProducts(page, limit);
    await AsyncStorage.setItem(
      STORAGE_KEYS.LAST_VIEWED_PRODUCTS,
      JSON.stringify(data.slice(0, 10))
    );
    return { page, limit, data };
  }
);

const slice = createSlice({
  name: 'products',
  initialState: {
    list: [],
    page: 1,
    limit: 20,
    loading: false,
    error: null,
    search: '',
    category: null,
  },
  reducers: {
    setSearch(state, action) { state.search = action.payload; },
    setCategory(state, action) { state.category = action.payload; },
    clear(state) { state.list = []; state.page = 1; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        const { page, data } = action.payload;
        state.page = page;
        state.list = page === 1 ? data : [...state.list, ...data];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSearch, setCategory, clear } = slice.actions;
