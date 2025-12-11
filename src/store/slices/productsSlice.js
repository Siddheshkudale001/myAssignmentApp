import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// optional async thunk to fetch products
export const fetchProducts = createAsyncThunk('products/fetch', async () => {
  const res = await fetch('https://fakestoreapi.com/products');
  return res.json();
});

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    setProducts(state, action) {
      state.list = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (s) => { s.status = 'loading'; })
      .addCase(fetchProducts.fulfilled, (s, a) => { s.status = 'succeeded'; s.list = a.payload; })
      .addCase(fetchProducts.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message; });
  },
});

export const { setProducts } = productsSlice.actions;
export default productsSlice.reducer;
