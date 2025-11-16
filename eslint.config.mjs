import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: globals.node,
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      eqeqeq: 'warn',
      'no-console': 'off',
    },
  },
  {
    files: ['**/_test/**'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
]);
