import { writable } from 'svelte/store';

// Create a writable store with initial null value
export const user = writable(null);

// Helper functions for user management
export const setUser = (userData) => {
    user.set(userData);
};

export const clearUser = () => {
    user.set(null);
}; 