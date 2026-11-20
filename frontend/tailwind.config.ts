import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Core Black & Charcoal
        black: {
          DEFAULT: '#090909',
          pure: '#000000',
          rich: '#090909',
          charcoal: '#111111',
          'charcoal-2': '#191919',
          surface: '#222222',
          'surface-2': '#2A2A2A',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-light': 'rgba(255, 255, 255, 0.15)',
        },
        // Signature Brand Red
        brand: {
          red: '#E50924',
          'red-deep': '#B90820',
          'red-bright': '#FF3048',
          'red-glow': 'rgba(229, 9, 36, 0.35)',
          'red-subtle': 'rgba(229, 9, 36, 0.12)',
        },
        // Primary alias for consistency with standard utility classes
        primary: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#FF3048',
          600: '#E50924', // Core brand red
          700: '#B90820',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
        // Luxury text colors
        text: {
          primary: '#FFFFFF',
          secondary: '#B8B8B8',
          muted: '#858585',
          dark: '#090909',
        },
        // Light shopping surfaces
        light: {
          bg: '#F5F5F5',
          card: '#FFFFFF',
          border: '#E5E5E5',
          muted: '#F0F0F0',
        }
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['Space Grotesk', 'Manrope', 'sans-serif'],
        mono: ['monospace'],
      },
      boxShadow: {
        'red-glow': '0 0 25px rgba(229, 9, 36, 0.35)',
        'red-glow-lg': '0 0 50px rgba(229, 9, 36, 0.45)',
        'card-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
        'card-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'radial-red': 'radial-gradient(circle, rgba(229, 9, 36, 0.22) 0%, rgba(9, 9, 9, 0) 70%)',
        'radial-red-strong': 'radial-gradient(circle, rgba(229, 9, 36, 0.4) 0%, rgba(9, 9, 9, 0) 65%)',
        'glossy-dark': 'linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)',
      }
    },
  },
  plugins: [],
}

export default config
