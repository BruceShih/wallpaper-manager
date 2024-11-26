// https://nuxt.com/docs/api/configuration/nuxt-config
import process from 'node:process'

const environment
  = process.env.NODE_ENV === 'development'
    ? 'local'
    : process.env.CF_PAGES_BRANCH === 'master'
      ? 'production'
      : process.env.CF_PAGES_BRANCH
        ?? 'unknown'
const sentryReleaseName = process.env.CF_PAGES_COMMIT_SHA ?? 'unknown commit'

export default defineNuxtConfig({
  // https://nuxt.com/modules
  modules: [
    '@nuxt/eslint',
    '@nuxthub/core',
    '@nuxtjs/robots',
    '@nuxtjs/color-mode',
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@vee-validate/nuxt',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@sentry/nuxt/module'
  ],

  // https://devtools.nuxt.com
  devtools: { enabled: true },
  sourcemap: { client: true },

  runtimeConfig: {
    origin: process.env.ORIGIN,
    public: {
      environment,
      imageOrigin: process.env.IMAGE_ORIGIN,
      sentryDsn: process.env.SENTRY_DSN,
      sentryReleaseName
    }
  },
  // https://nuxt.com/docs/getting-started/upgrade#testing-nuxt-4
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2024-07-30',

  sentry: {
    sourceMapsUploadOptions: {
      org: 'bruce-shih',
      project: 'wallpaper-manager',
      authToken: process.env.SENTRY_AUTH_TOKEN
    },
    unstable_sentryBundlerPluginOptions: {
      release: {
        name: sentryReleaseName,
        deploy: {
          env: environment,
          url: process.env.CF_PAGES_URL
        }
      }
    }
  },

  eslint: {
    config: {
      standalone: false
    }
  },

  // temporary fix: https://github.com/unovue/shadcn-vue/issues/864
  colorMode: {
    classSuffix: ''
  },

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './app/components/ui'
  },

  image: {
    cloudflare: {
      baseURL: process.env.IMAGE_ORIGIN
    }
  },

  // https://hub.nuxt.com/docs/getting-started/installation#options
  hub: {
    blob: true,
    cache: true,
    database: true,
    kv: true
  },

  site: { indexable: false }
})
