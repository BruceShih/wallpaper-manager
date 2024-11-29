import type { UserToken } from '~~/server/utils/drizzle'
import { consola } from 'consola'
import { eq } from 'drizzle-orm'
import { userToken } from '~~/server/database/schema'
import { serverAuth } from '~~/server/utils/auth'
import { useDrizzle } from '~~/server/utils/drizzle'

export default defineEventHandler(async (event) => {
  const session = await serverAuth().api.getSession({
    headers: event.headers
  })

  if (!session) {
    consola.error('Unauthorized')
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
      consola.error(error)
      throw createError(error)
    }
  }
})
