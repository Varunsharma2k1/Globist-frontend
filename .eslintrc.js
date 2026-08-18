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
    // Off: this rule can't trace styles through the codebase's
    // `getStyles(colors)` factory pattern (StyleSheet.create() called
    // inside a function and returned, rather than assigned directly to a
    // module-level `styles` const), so it flags nearly every style as
    // "unused" across the whole app — pure noise here, not a real signal.
    'react-native/no-unused-styles': 'off',
    'react-native/no-inline-styles': 'off',
    // Encourages splitting a file into hooks/sub-components once it grows
    // past a screen-sized chunk, rather than letting one file accumulate
    // unrelated concerns. Warn (not error) so it doesn't block a WIP file
    // mid-edit — treat it as a prompt to extract, not a hard limit.
    'max-lines': [
      'warn',
      { max: 200, skipBlankLines: true, skipComments: true },
    ],
    // `no-unused-vars` (from eslint:recommended) already flags unused
    // imports as an error — this just makes sure destructured-but-unused
    // function args (a common source of stale props) are caught too.
    'no-unused-vars': [
      'error',
      { args: 'after-used', argsIgnorePattern: '^_', ignoreRestSiblings: true },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
