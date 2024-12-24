import type { RouteLocationRaw } from 'vue-router'
import { defu } from 'defu'
import { authClient } from '~/lib/authClient'

interface RuntimeAuthConfig {
  redirectUserTo: RouteLocationRaw | string
  redirectGuestTo: RouteLocationRaw | string
}

export function useAuth() {
  const options = defu(useRuntimeConfig().public.auth as Partial<RuntimeAuthConfig>, {
    redirectUserTo: '/gallery',
    redirectGuestTo: '/'
  })

  return {
    options,
    client: authClient
  }
}
