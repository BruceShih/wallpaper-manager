import type { RowData } from '@tanstack/vue-table'

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

declare module '@tanstack/vue-table' {
  interface TableMeta<TData extends RowData> {
    removeRows: (keys: string[]) => Promise<void>
  }
}

// It is always important to ensure you import/export something when augmenting a type
export {}
