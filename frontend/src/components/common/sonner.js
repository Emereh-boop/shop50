import { writable } from 'svelte/store';

export const sonnerStore = writable([]);

function showToast(type, message) {
  sonnerStore.update((toasts) => [
    ...toasts,
    { id: Date.now() + Math.random(), type, message }
  ]);
}

export const toast = {
  info: (msg) => showToast('info', msg),
  error: (msg) => showToast('error', msg),
  warning: (msg) => showToast('warning', msg),
  success: (msg) => showToast('success', msg)
}; 