const { join } = require('path');
const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const componentsConfig = require('../../libs/ui/shared/tailwind.config');
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, '{src,pages,components}/**/*!(*.stories|*.spec).{ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    ...componentsConfig.theme,
    extend: {
      ...componentsConfig.theme.extend,
    },
  },
  plugins: [...componentsConfig.plugins],
}

