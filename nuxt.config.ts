// https://nuxt.com/docs/api/configuration/nuxt-config
import process from 'node:process'

export default defineNuxtConfig({
  // https://nuxt.com/modules
  modules: [
    '@nuxt/eslint',
    '@nuxthub/core',
    '@nuxtjs/robots',
    '@nuxtjs/color-mode',
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@formkit/auto-animate/nuxt',
    '@nuxt/fonts',
    '@nuxt/icon'
  ],

  // https://devtools.nuxt.com
  devtools: { enabled: true },

  // Env variables - https://nuxt.com/docs/getting-started/configuration#environment-variables-and-private-tokens
  runtimeConfig: {
    authKeySecret: process.env.AUTH_KEY_SECRET,
    hubCloudflareAccessClientId: process.env.NUXT_HUB_CLOUDFLARE_ACCESS_CLIENT_ID,
    hubCloudflareAccessClientSecret: process.env.NUXT_HUB_CLOUDFLARE_ACCESS_CLIENT_SECRET
  },
  // https://nuxt.com/docs/getting-started/upgrade#testing-nuxt-4
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2024-07-30',

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

  // https://hub.nuxt.com/docs/getting-started/installation#options
  hub: {
    blob: true,
    cache: true,
    database: true,
    kv: true
  },

  site: { indexable: false }
})
