import type { ApiTokenCreateResponse } from '~~/server/types/api/token'
import consola from 'consola'
import { userToken } from '~~/server/database/schema'
import { useDrizzle } from '~~/server/types/drizzle'

export default defineEventHandler<unknown, ApiTokenCreateResponse>(async (event) => {
  const session = await serverAuth().api.getSession({
    headers: event.headers
  })

  if (!session) {
    consola.error('Unauthorized')
    throw createError({ statusCode: 401 })
  }

  try {
    const token = await useDrizzle()
      .insert(userToken)
      .values({
        userId: session?.user.id,
        token: crypto.randomUUID().replaceAll('-', ''),
        enabled: true,
        createDate: new Date().toISOString()
      })
      .returning()

    return token
  }
  catch (error) {
    if (error instanceof Error) {
      consola.error(error)
      throw createError(error)
    }
  }
})
