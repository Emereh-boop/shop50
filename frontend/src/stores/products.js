import { writable } from 'svelte/store';

export const products = writable({
  products: [],
  loading: false,
  error: null
}); 