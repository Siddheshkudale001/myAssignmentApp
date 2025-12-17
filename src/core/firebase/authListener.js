import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './authInstance';
import { setAuthUser, clearAuth } from '../../store/slices/authSlice';
import { setFavorites, clearFavorites } from '../../store/slices/favoritesSlice';
import { fetchFavorites } from './favorites';

export const initAuthListener = (dispatch) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      dispatch(
        setAuthUser({
          uid: user.uid,
          email: user.email,
        })
      );

      // 🔥 LOAD FAVORITES FROM FIRESTORE
      const favIds = await fetchFavorites(user.uid);
      dispatch(setFavorites(favIds));
    } else {
      dispatch(clearAuth());
      dispatch(clearFavorites());
    }
  });
};
