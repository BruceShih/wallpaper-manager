import { createError, defineEventHandler, serverAuth } from '#imports'
import { userToken } from '~~/server/database/schema'
import { eq, useDrizzle, type UserToken } from '~~/server/utils/drizzle'
import { consola } from 'consola'

export default defineEventHandler(async (event) => {
  const session = await serverAuth().api.getSession({
    headers: event.headers
  })

  if (!session) {
    consola.withTag(`In server route: ${event.path}`).error('Unauthorized')
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
      consola.withTag(`In server route: ${event.path}`).error(error)
      throw createError(error)
    }
  }
})
