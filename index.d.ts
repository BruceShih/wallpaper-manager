declare module 'nuxt/schema' {
  interface RuntimeConfig {
    origin: string | undefined
  }
  interface PublicRuntimeConfig {
    imageOrigin: string | undefined
  }
}

// It is always important to ensure you import/export something when augmenting a type
export {}
