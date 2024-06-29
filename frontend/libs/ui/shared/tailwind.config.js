const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

const cloudCrafterColors = {
  '50': '#fefce8',
  '100': '#fef9c3',
  '200': '#fef08a',
  '300': '#fde047',
  '400': '#facc15',
  '500': '#eab308',
  '600': '#ca8a04',
  '700': '#a16207',
  '800': '#854d0e',
  '900': '#713f12',
  '950': '#422006',
};

const mint = {
  50: '#F4FCF7',
  100: '#D3F5DF',
  200: '#B3EDC8',
  300: '#92E5B0',
  400: '#83CE9E',
  500: '#75B78D',
  600: '#58896A',
  700: '#497358',
  800: '#3A5C46',
  900: '#2C4535',
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, '{src,pages,components}/**/*!(*.stories|*.spec).{ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      borderRadius: {
        inherit: 'inherit',
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      inset: {
        center: 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
      },
    },
    colors: {
      ...colors,
      cloudcrafter: cloudCrafterColors,
      mint: mint,

      primary: cloudCrafterColors,
      gray: colors.zinc,
      warning: colors.amber,
      success: colors.emerald,
      error: colors.rose,
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries')
  ],
};
