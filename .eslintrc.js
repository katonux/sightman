module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    perser: 'babael-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: [
    'eslint:recommended',
    '@nuxtjs/eslint-config-typescript',
    'prettier',
    'prettier/vue',
    'plugin:nuxt/recommended',
    // 'plugin:vue/vue3-recommended',
  ],
  plugins: ['vue'],
  // add your custom rules here
  rules: {
    'semi': ['error', 'never'],
    'quotes': ['warn', 'single'],
    'no-console': 'off'
  },
}
