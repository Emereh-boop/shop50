import { writable } from 'svelte/store';

export const adminUsers = writable({
  users: [],
  loading: false,
  error: null,
  loaded: false
});

let fetchPromise = null;

export async function fetchAdminUsers(force = false) {
  let alreadyLoaded;
  adminUsers.subscribe(store => alreadyLoaded = store.loaded)();
  if (alreadyLoaded && !force) return;
  if (fetchPromise) return fetchPromise;

  adminUsers.update(store => ({ ...store, loading: true, error: null }));

  fetchPromise = (async () => {
    try {
      const response = await fetch('https://shop50.onrender.com/api/admin/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      adminUsers.set({ users: data, loading: false, error: null, loaded: true });
    } catch (e) {
      adminUsers.set({ users: [], loading: false, error: e.message, loaded: false });
    } finally {
      fetchPromise = null;
    }
  })();

  return fetchPromise;
} 