import { writable } from 'svelte/store';

export const onlineUsers = writable({
  users: [],
  loading: false,
  error: null,
  lastFetched: 0
});

let fetchPromise = null;
const CACHE_DURATION = 30000; // 30 seconds

export async function fetchOnlineUsers(force = false) {
  let lastFetched;
  onlineUsers.subscribe(store => lastFetched = store.lastFetched)();
  const now = Date.now();
  if (!force && now - lastFetched < CACHE_DURATION) return;
  if (fetchPromise) return fetchPromise;

  onlineUsers.update(store => ({ ...store, loading: true, error: null }));

  fetchPromise = (async () => {
    try {
      const response = await fetch('https://shop50.onrender.com/api/users/online');
      if (!response.ok) throw new Error('Failed to fetch online users');
      const data = await response.json();
      onlineUsers.set({ users: data, loading: false, error: null, lastFetched: Date.now() });
    } catch (e) {
      onlineUsers.set({ users: [], loading: false, error: e.message, lastFetched: 0 });
    } finally {
      fetchPromise = null;
    }
  })();

  return fetchPromise;
} 