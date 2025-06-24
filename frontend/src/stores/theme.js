import { writable } from 'svelte/store';

// Theme constants
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

// Get initial theme from localStorage or default to 'system'
const storedTheme = typeof localStorage !== 'undefined' ? localStorage.getItem('theme') : THEMES.SYSTEM;
export const theme = writable(storedTheme);

// Subscribe to theme changes and update localStorage
theme.subscribe((value) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('theme', value);
  }
  
  // Update document class based on theme
  if (value === THEMES.DARK || (value === THEMES.SYSTEM && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
});

// Listen for system theme changes
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (localStorage.getItem('theme') === THEMES.SYSTEM) {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  });
}

// Helper functions
export const toggleTheme = () => {
  theme.update(current => {
    if (current === THEMES.DARK) return THEMES.LIGHT;
    if (current === THEMES.LIGHT) return THEMES.SYSTEM;
    return THEMES.DARK;
  });
};

export const setTheme = (newTheme) => {
  if (Object.values(THEMES).includes(newTheme)) {
    theme.set(newTheme);
  }
}; 