import { createSlice } from '@reduxjs/toolkit';

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    ids: [],
  },
  reducers: {
    toggleFavorite: (state, action) => {
      const id = Number(action.payload);
      if (state.ids.includes(id)) {
        state.ids = state.ids.filter((x) => x !== id);
      } else {
        state.ids.push(id);
      }
    },
    setFavorites: (state, action) => {
      state.ids = action.payload.map(Number);
    },
    clearFavorites: (state) => {
      state.ids = [];
    },
  },
});

export const {
  toggleFavorite,
  setFavorites,
  clearFavorites,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
