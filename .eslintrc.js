module.exports = {
  root: true,
  env: {
    'react-native/react-native': true,
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: ['react', 'react-native', 'react-hooks'],
  rules: {
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react-native/no-unused-styles': 'warn',
    'react-native/no-inline-styles': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
