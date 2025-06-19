import { writable, derived } from 'svelte/store';

// Create stores
export const user = writable(null);
export const token = writable(null);
export const isAuthenticated = derived(user, $user => !!$user);

// Initialize from localStorage if in browser
if (typeof window !== 'undefined') {
  const storedUser = localStorage.getItem('user');
  const storedToken = localStorage.getItem('token');
  
  if (storedUser) {
    user.set(JSON.parse(storedUser));
  }
  if (storedToken) {
    token.set(storedToken);
  }
}

// Auth actions
export const auth = {
  login: async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
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
      user.set(data.user);
      token.set(data.token);
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      
      return data;
    } catch (error) {
      throw error;
    }
  },

  register: async (name, email, password) => {
    try {
      const response = await fetch('/api/auth/register', {
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
      user.set(data.user);
      token.set(data.token);
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      
      return data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    // Clear stores
    user.set(null);
    token.set(null);
    
    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },

  checkAuth: () => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      user.set(JSON.parse(storedUser));
      token.set(storedToken);
      return true;
    }
    return false;
  }
}; 