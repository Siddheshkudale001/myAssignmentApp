
// src/state/slices/categoriesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCategories } from '../../services/categoriesService';

export const fetchCategories = createAsyncThunk('categories/fetch', async () => {
  const data = await getCategories();
  return data;
});

const slice = createSlice({
  name: 'categories',
  initialState: { list: [], selected: null, loading: false, error: null },
  reducers: {
    select(state, action) { state.selected = action.payload; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => { state.loading = true; })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { select } = slice.actions;
export default slice.reducer;
