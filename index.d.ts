declare module 'nuxt/schema' {
  interface RuntimeConfig {
    origin: string | undefined
  }
  interface PublicRuntimeConfig {
    environment: string
    imageOrigin: string | undefined
    sentryDsn: string | undefined
    sentryReleaseName: string
  }
}

// It is always important to ensure you import/export something when augmenting a type
export {}
