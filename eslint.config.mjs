import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      'no-unused-vars': 'warn',
    },
  },
  pluginJs.configs.recommended,
];
