// https://nuxt.com/docs/api/configuration/nuxt-config
import process from 'node:process'

export default defineNuxtConfig({
  // https://nuxt.com/modules
  modules: ['@nuxthub/core', '@nuxt/eslint', '@nuxt/ui', '@nuxtjs/robots'],

  // https://devtools.nuxt.com
  devtools: { enabled: true },

  // Env variables - https://nuxt.com/docs/getting-started/configuration#environment-variables-and-private-tokens
  runtimeConfig: {
    authKeySecret: process.env.AUTH_KEY_SECRET,
    hubCloudflareAccessClientId: process.env.NUXT_HUB_CLOUDFLARE_ACCESS_CLIENT_ID,
    hubCloudflareAccessClientSecret: process.env.NUXT_HUB_CLOUDFLARE_ACCESS_CLIENT_SECRET,
    public: {
      // Can be overridden by NUXT_PUBLIC_HELLO_TEXT environment variable
      helloText: 'Hello from the Edge 👋'
    }
  },
  // https://nuxt.com/docs/getting-started/upgrade#testing-nuxt-4
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2024-07-30',

  // https://hub.nuxt.com/docs/getting-started/installation#options
  hub: {
    blob: true,
    cache: true,
    database: true,
    kv: true
  },

  site: { indexable: false }
})
