// @ts-check
import antfu from '@antfu/eslint-config'
import oxlint from 'eslint-plugin-oxlint'
import tailwind from 'eslint-plugin-tailwindcss'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu({
    formatters: true,
    vue: {
      overrides: {
        'vue/attributes-order': ['error', {
          order: [
            'DEFINITION',
            'LIST_RENDERING',
            'CONDITIONALS',
            'RENDER_MODIFIERS',
            'GLOBAL',
            ['UNIQUE', 'SLOT'],
            'TWO_WAY_BINDING',
            'OTHER_DIRECTIVES',
            'OTHER_ATTR',
            'EVENTS',
            'CONTENT'
          ],
          alphabetical: true
        }],
        'vue/max-attributes-per-line': ['error', {
          multiline: {
            max: 1
          }
        }]
      }
    },
    typescript: true,
    ignores: [
      '**/migrations'
    ]
  }, {
    files: ['**/*.vue'],
    rules: {
      'vue/attributes-order': ['error'],
      'vue/max-attributes-per-line': ['error', {
        multiline: {
          max: 1
        }
      }]
    }
  }, {
    rules: {
      'style/max-len': ['warn', { code: 110, ignoreStrings: true, ignoreTemplateLiterals: true }],
      'style/comma-dangle': ['error', 'never'],
      'style/multiline-ternary': ['error', 'always-multiline'],
      'style/no-tabs': ['error', {
        allowIndentationTabs: false
      }],
      'style/quotes': ['error', 'single'],
      'ts/no-explicit-any': ['error']
    }
  })
    .prepend(oxlint.configs['flat/recommended'])
    .prepend(...tailwind.configs['flat/recommended'])
    // .prepend(...oxlint.buildFromOxlintConfigFile('./oxlint.json'))

)
