import { consola } from 'consola'
import { userToken } from '../database/schema'

export default defineEventHandler(async (event) => {
  const { origin } = useRuntimeConfig(event)

  if (!origin) {
    consola.error(new Error('Missing runtime config'))
    throw createError({ statusCode: 500 })
  }

  const headers = {
    origin: event.headers.get('Origin') || '',
    referer: event.headers.get('Referer') || ''
  }
  const isFromCloudflare
    = headers.origin.startsWith(origin) || headers.referer.startsWith(origin)

  if (!isFromCloudflare) {
    if (event.path.startsWith('/api/image')) {
      const authHeader = event.headers.get('Authorization')

      if (!authHeader) {
        consola.error(new Error('Missing authorization header'))
        throw createError({ statusCode: 401 })
      }

      const token = authHeader.replace('Bearer ', '')

      try {
        const allTokens = await useDrizzle()
          .select()
          .from(userToken)
          .where(eq(userToken.enabled, true))

        const validToken = allTokens.find(t => t.token === token)

        if (!validToken) {
          consola.error(new Error('No valid token found'))
          throw createError({ statusCode: 401 })
        }
      }
      catch (error) {
        if (error instanceof Error) {
          consola.error(new Error('Server error'))
          throw createError(error)
        }
      }
    }
  }
})
