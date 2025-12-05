
// src/hooks/useProducts.js
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, setSearch, setCategory, clear } from '../state/slices/productsSlice';

export function useProducts() {
  const dispatch = useDispatch();
  const state = useSelector(s => s.products);

  return {
    // current redux state
    ...state,

    // actions as convenient helpers
    fetch: (payload) => dispatch(fetchProducts(payload)),
    search: (q) => dispatch(setSearch(q)),
    pickCategory: (c) => dispatch(setCategory(c)),
    clear: () => dispatch(clear()),
  };
}
