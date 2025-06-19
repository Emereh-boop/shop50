import { writable } from 'svelte/store';

export const modalStore = writable({
  auth: false,
  cart: false
});

export function toggleAuthModal() {
  modalStore.update(state => ({
    ...state,
    auth: !state.auth
  }));
}

export function toggleCartModal() {
  modalStore.update(state => ({
    ...state,
    cart: !state.cart
  }));
}

export function closeAllModals() {
  modalStore.set({
    auth: false,
    cart: false
  });
} 