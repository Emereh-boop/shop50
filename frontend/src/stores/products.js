import { writable } from 'svelte/store';

export const products = writable({
  products: [],
  loading: false,
  error: null,
  loaded: false
});

let fetchPromise = null;

export async function fetchProducts(force = false) {
  let alreadyLoaded;
  products.subscribe(store => alreadyLoaded = store.loaded)();
  if (alreadyLoaded && !force) return;
  if (fetchPromise) return fetchPromise;

  products.update(store => ({ ...store, loading: true, error: null }));

  fetchPromise = (async () => {
    try {
      const response = await fetch('https://shop50.onrender.com/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      products.set({ products: data, loading: false, error: null, loaded: true });
    } catch (e) {
      products.set({ products: [], loading: false, error: e.message, loaded: false });
    } finally {
      fetchPromise = null;
    }
  })();

  return fetchPromise;
} 