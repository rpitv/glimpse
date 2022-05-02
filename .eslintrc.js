module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  plugins: [
    'jest-dom'
  ],
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended',
    'plugin:jest-dom/recommended',
    'plugin:cypress/recommended'
  ],
  // add your custom rules here
  rules: {
    'jest-dom/prefer-required': 'error',
    'jest-dom/prefer-enabled-disabled': 'error',
    'jest-dom/prefer-checked': 'error',
    'jest-dom/prefer-to-have-attribute': 'error',
    'no-console': 'off',
    'vue/comment-directive': 'off'
  }
}
