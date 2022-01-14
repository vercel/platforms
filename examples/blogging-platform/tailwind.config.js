const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  mode: 'jit',
  purge: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      cal: ['Cal Sans', 'Inter var', 'sans-serif'],
    },
    extend: {
      width: {
        1536: '1536px',
      },
      height: {
        150: '37.5rem',
      },
      margin: {
        30: '7.5rem',
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
        mono: ['Consolas', ...defaultTheme.fontFamily.mono],
      },
      typography: {
        DEFAULT: {
          css: {
            h1: {
              fontFamily: 'Cal Sans',
            },
            h2: {
              fontFamily: 'Cal Sans',
            },
            h3: {
              fontFamily: 'Cal Sans',
            },
            'blockquote p:first-of-type::before': { content: 'none' },
            'blockquote p:first-of-type::after': { content: 'none' },
          },
        },
      },
      keyframes: {
        wiggle: {
          '0%, 100%': {
            transform: 'translateX(0%)',
            transformOrigin: '50% 50%',
          },
          '15%': { transform: 'translateX(-6px) rotate(-6deg)' },
          '30%': { transform: 'translateX(9px) rotate(6deg)' },
          '45%': { transform: 'translateX(-9px) rotate(-3.6deg)' },
          '60%': { transform: 'translateX(3px) rotate(2.4deg)' },
          '75%': { transform: 'translateX(-2px) rotate(-1.2deg)' },
        },
      },
      animation: {
        wiggle: 'wiggle 0.8s both',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};
