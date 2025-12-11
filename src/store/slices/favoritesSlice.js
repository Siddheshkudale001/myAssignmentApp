import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ids: [], // only store IDs -> KISS
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite(state, action) {
      const id = action.payload;
      if (state.ids.includes(id)) {
        state.ids = state.ids.filter((x) => x !== id);
      } else {
        state.ids.push(id);
      }
    },
    removeFavorite(state, action) {
      const id = action.payload;
      state.ids = state.ids.filter((x) => x !== id);
    },
    clearFavorites(state) {
      state.ids = [];
    },
    setFavorites(state, action) {
      state.ids = action.payload || [];
    },
  },
});

export const { toggleFavorite, removeFavorite, clearFavorites, setFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
