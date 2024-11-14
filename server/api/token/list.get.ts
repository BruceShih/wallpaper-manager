import { userToken } from '~~/server/database/schema'
import { eq, useDrizzle, type UserToken } from '~~/server/utils/drizzle'

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
    const list: UserToken[] = await useDrizzle()
      .select()
      .from(userToken)
      .where(eq(userToken.userId, session?.user.id))

    return list
  }
  catch (error) {
    if (error instanceof Error)
      throw createError(error)
  }
})
