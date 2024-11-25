import { userToken } from '~~/server/database/schema'
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
      consola.withTag(`In server route: ${event.path}`).error(error)
      throw createError(error)
    }
  }
})
