/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#000000',
          dark: '#ffffff'
        },
        secondary: {
          light: '#4B5563',
          dark: '#9CA3AF'
        },
        background: {
          light: '#ffffff',
          dark: '#111827'
        },
        surface: {
          light: '#F3F4F6',
          dark: '#1F2937'
        },
        accent: '#0066cc',
        'text-primary': '#000000',
        'text-secondary': '#767677',
        'text-primary-dark': '#ffffff',
        'text-secondary-dark': '#a3a3a3'
      },
      fontFamily: {
        sans: ['AdihausDIN', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['AdineuePRO', 'Helvetica', 'Arial', 'sans-serif']
      }
    }
  },
  plugins: []
}; 