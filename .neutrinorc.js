const typescript = require('neutrinojs-typescript');
const airbnb = require('@neutrinojs/airbnb');
const typescriptLint = require('neutrinojs-typescript-eslint');
const copy = require('@neutrinojs/copy');
const react = require('@neutrinojs/react');
const jest = require('@neutrinojs/jest');

module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    typescript({ tsconfig: {
      compilerOptions: {
        strict: true,
        allowJs: true,
        declaration: true,
        importsNotUsedAsValues: 'remove',
        typeRoots: [
          'src/types', // custom types directory
          'node_modules/@types',
        ],
      },
      include: [''], // sources and tests are included by default
      exclude: ['build',  'node_modules'],
    } }), // must be first in use section
    typescriptLint({
      recommended: true,
    }),
    airbnb({
      eslint: {
        "rules": {
          // note you must disable the base rule as it can report incorrect errors
          "no-use-before-define": "off",
          "@typescript-eslint/no-use-before-define": ["error"],
          "react/require-default-props": [1, { ignoreFunctionalComponents: true }]
        },
      },
    }),
    copy({
      patterns: ['src/resources/favicon.ico'],
    }),
    react({
      publicPath: "/",
      html: {
        title: 'Standup Mood App'
      }
    }),
    jest(),
  ],
};
