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
    fontFamily: {
      serif: ['Merriweather', 'serif'],
      sans: ['Nunito Sans', 'sans-serif'],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
