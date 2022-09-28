module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:import/errors',
    'plugin:react/jsx-runtime',
    'plugin:jsx-a11y/recommended',
    'standard'
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    'react', 'import', 'jsx-a11y'
  ],
  rules: {
    'react/jsx-uses-react': 'error',
    'react/prop-types': 0,
    indent: ['error', 2],
    'linebreak-style': 1
  }
}
