const colors = require('tailwindcss/colors');

module.exports = {
  purge: [],
  darkMode: 'media',
  theme: {
    extend: {},
    // textColor: theme => theme('colors'),
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.coolGray,
      red: colors.red,
      yellow: colors.amber,
      blue: colors.blue,
      pink: colors.pink,
      teal: colors.teal,
      blueGray: colors.blueGray,
    },
  },
  fontFamily: {
    sans: ['Open Sans', 'sans-serif'],
    serif: ['Merriweather', 'serif'],
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
