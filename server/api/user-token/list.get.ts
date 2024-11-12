import { userToken } from '~~/server/database/schema'
import { eq, useDrizzle } from '~~/server/utils/drizzle'

export default eventHandler(async (event) => {
  const session = await serverAuth().api.getSession({
    headers: event.headers
  })

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  try {
    const list = await useDrizzle()
      .select()
      .from(userToken)
      .where(eq(userToken.userId, session?.user.id))

    return list
  }
  catch (error) {
    console.error('[Wallpaper Service] Server error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Server error'
    })
  }
})
