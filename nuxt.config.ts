// https://nuxt.com/docs/api/configuration/nuxt-config
import process from 'node:process'
import wasm from 'vite-plugin-wasm'

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
    '@pinia/nuxt'
    // 'nuxt-eslint-auto-explicit-import'
  ],
  // https://devtools.nuxt.com
  devtools: { enabled: true },
  ssr: false,
  // imports: {
  //   autoImport: false
  // },
  build: {
    transpile: ['@jsquash/jpeg']
  },
  vite: {
    plugins: [wasm()],
    optimizeDeps: {
      exclude: ['@jsquash/jpeg']
    }
  },
  sourcemap: { client: true },
  runtimeConfig: {
    origin: process.env.ORIGIN,
    public: {
      imageOrigin: process.env.IMAGE_ORIGIN
    }
  },
  // https://nuxt.com/docs/getting-started/upgrade#testing-nuxt-4
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2024-07-30',
  nitro: {
    experimental: {
      openAPI: true
    }
  },
  typescript: {
    typeCheck: true
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
