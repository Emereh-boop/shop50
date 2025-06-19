import { writable } from 'svelte/store';

export const showCart = writable(false);
export const showAuthModal = writable(false);
export const authMode = writable('login'); 