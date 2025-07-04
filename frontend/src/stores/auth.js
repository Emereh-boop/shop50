import { writable, derived } from 'svelte/store';
import { syncLocalToBackend } from '../utils/interested.js';
import { user, setUser, clearUser } from './user';

export { user, setUser, clearUser };
export const token = writable(null);
export const isAuthenticated = derived(user, $user => !!$user);

// Initialize from localStorage if in browser
if (typeof window !== 'undefined') {
  const storedUser = localStorage.getItem('user');
  const storedToken = localStorage.getItem('token');
  
  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }
  if (storedToken) {
    token.set(storedToken);
  }
}

// Auth actions
export const auth = {
  login: async (email, password) => {
    try {
      const response = await fetch('https://shop50.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      // Update stores
      setUser(data.user);
      token.set(data.token);
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      
      // Sync localStorage interested products to backend
      await syncLocalToBackend();
      
      return data;
    } catch (error) {
      throw error;
    }
  },

  register: async (name, email, password) => {
    try {
      const response = await fetch('https://shop50.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      
      // Update stores
      setUser(data.user);
      token.set(data.token);
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      
      // Sync localStorage interested products to backend
      await syncLocalToBackend();
      
      return data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    clearUser();
    token.set(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },

  checkAuth: () => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser));
      token.set(storedToken);
      return true;
    }
    return false;
  }
}; 