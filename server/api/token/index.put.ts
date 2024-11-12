import { userToken } from '~~/server/database/schema'
import { useDrizzle } from '~~/server/utils/drizzle'

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
    await useDrizzle()
      .insert(userToken)
      .values({
        userId: session?.user.id,
        token: crypto.randomUUID(),
        enabled: true,
        createDate: new Date().toISOString()
      })

    return 'Token created'
  }
  catch (error) {
    console.error('[Wallpaper Service] Server error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Server error'
    })
  }
})
