import { createAuthClient } from 'better-auth/vue'

const headers = import.meta.server ? useRequestHeaders() : undefined

export const authClient = createAuthClient({
  fetchOptions: {
    headers
  }
})
