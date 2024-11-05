// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    '@stylistic/quotes': ['error', 'single'],
    '@stylistic/comma-dangle': ['error', 'never']
  }
}
).overrideRules({
  'vue/max-attributes-per-line': ['warn', { singleline: 3 }]
})
