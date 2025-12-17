import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null, // { uid, email }
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
    },
  },
});

export const { setAuthUser, clearAuth } = authSlice.actions;

export default authSlice.reducer;
