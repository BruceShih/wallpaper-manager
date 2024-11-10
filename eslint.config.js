import antfu from '@antfu/eslint-config'
import tailwind from 'eslint-plugin-tailwindcss'

export default antfu({
  formatters: true,
  vue: true,
  ignores: [
    '**/migrations'
  ]
}, {
  rules: {
    'style/comma-dangle': ['error', 'never'],
    'style/multiline-ternary': ['error', 'always-multiline'],
    'style/no-tabs': ['error', { allowIndentationTabs: false }],
    'style/quotes': ['error', 'single'],
    'vue/max-attributes-per-line': ['error', {
      multiline: {
        max: 1
      }
    }]
  }
})
  .prepend(...tailwind.configs['flat/recommended'])
