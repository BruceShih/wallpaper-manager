import antfu from '@antfu/eslint-config'

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
    'style/quotes': ['error', 'single']
  }
})
