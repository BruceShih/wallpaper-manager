import { userToken } from '~~/server/database/schema'
import { useDrizzle } from '~~/server/utils/drizzle'

export default eventHandler(async (event) => {
  const session = await serverAuth().api.getSession({
    headers: event.headers
  })

  if (!session) {
    throw createError({
      statusCode: 401,
      cause: 'User not authenticated'
    })
  }

  try {
    await useDrizzle()
      .insert(userToken)
      .values({
        userId: session?.user.id,
        token: crypto.randomUUID().replaceAll('-', ''),
        enabled: true,
        createDate: new Date().toISOString()
      })

    return 'Token created'
  }
  catch (error) {
    if (error instanceof Error)
      throw createError(error)
  }
})
