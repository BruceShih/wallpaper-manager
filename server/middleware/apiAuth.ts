import { userToken } from '../database/schema'

// only authenticate requests not from cloudflare workers
export default defineEventHandler(async (event) => {
  if (event.path.startsWith('/api/image')) {
    const authHeader = event.headers.get('Authorization')

    if (!authHeader) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }

    const token = authHeader.replace('Bearer ', '')

    try {
      const allTokens = await useDrizzle()
        .select()
        .from(userToken)
        .where(eq(userToken.enabled, true))

      const validToken = allTokens.find(t => t.token === token)

      if (!validToken) {
        throw createError({
          statusCode: 401,
          message: 'Unauthorized'
        })
      }
    }
    catch (error) {
      console.error('[Wallpaper Service] Server error:', error)
      throw createError({
        statusCode: 500,
        message: 'Server error'
      })
    }
  }
})
