declare module 'nuxt/schema' {
  interface RuntimeConfig {
  }
  interface PublicRuntimeConfig {
    origin: string | undefined
    imageOrigin: string | undefined
  }
}
// It is always important to ensure you import/export something when augmenting a type
export {}
