import { writable } from 'svelte/store';

// Initialize cart from localStorage if available
const storedCart = localStorage.getItem('cart');
const initialCart = storedCart ? JSON.parse(storedCart) : [];

export const cart = writable(initialCart);

// Subscribe to cart changes and update localStorage
cart.subscribe(value => {
  localStorage.setItem('cart', JSON.stringify(value));
});

export function calculateTotal(cartArr) {
  return cartArr?.reduce((total, item) => total + item?.price * item?.quantity, 0);
} 