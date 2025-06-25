import { writable } from 'svelte/store';

export const adminOrders = writable({
  orders: [],
  loading: false,
  error: null,
  loaded: false
});

let fetchPromise = null;

export async function fetchAdminOrders(force = false) {
  let alreadyLoaded;
  adminOrders.subscribe(store => alreadyLoaded = store.loaded)();
  if (alreadyLoaded && !force) return;
  if (fetchPromise) return fetchPromise;

  adminOrders.update(store => ({ ...store, loading: true, error: null }));

  fetchPromise = (async () => {
    try {
      const response = await fetch('https://shop50.onrender.com/api/admin/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      adminOrders.set({ orders: data, loading: false, error: null, loaded: true });
    } catch (e) {
      adminOrders.set({ orders: [], loading: false, error: e.message, loaded: false });
    } finally {
      fetchPromise = null;
    }
  })();

  return fetchPromise;
} 