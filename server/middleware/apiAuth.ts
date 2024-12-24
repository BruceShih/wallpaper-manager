import consola from 'consola'
import { eq } from 'drizzle-orm'
import { userToken } from '../database/schema'
import { useDrizzle } from '../types/drizzle'

// this hits both the client and the server
export default defineEventHandler(async (event) => {
  if (event.path.startsWith('/api/auth')) {
    return
  }

  if (event.path.startsWith('/api')) {
    const session = await serverAuth().api.getSession({
      headers: event.headers
    })

    if (!session) {
      const authHeader = event.headers.get('Authorization')

      if (!authHeader) {
        consola.error(new Error('Missing authorization header'))
        throw createError({ statusCode: 403 })
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
          throw createError({ statusCode: 403 })
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
