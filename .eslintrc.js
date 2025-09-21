module.exports = {
  root: true,
  extends: ['next', 'next/core-web-vitals', 'eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',       // allow 'any'
    '@typescript-eslint/no-unused-vars': 'warn',      // warn instead of error
    '@next/next/no-img-element': 'off',               // allow <img> tags
    'react/no-unescaped-entities': 'off',             // allow unescaped ' and "
  },
};
