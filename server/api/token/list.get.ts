import { userToken } from '~~/server/database/schema'
import { useLogger } from 'nuxt/kit'

export default defineEventHandler(async (event) => {
  const session = await serverAuth().api.getSession({
    headers: event.headers
  })

  if (!session) {
    useLogger(`In server route: ${event.path}`).error('Unauthorized')
    throw createError({ statusCode: 401 })
  }

  try {
    const list: UserToken[] = await useDrizzle()
      .select()
      .from(userToken)
      .where(eq(userToken.userId, session?.user.id))

    return list
  }
  catch (error) {
    if (error instanceof Error) {
      useLogger(`In server route: ${event.path}`).error(error)
      throw createError(error)
    }
  }
})
