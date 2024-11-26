import { useLogger } from '@nuxt/kit'
import { userToken } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const path = await getValidatedRouterParams(event, data => apiTokenDeletePathSchema.safeParse(data))
  if (!path.success) {
    useLogger(`In server route: ${event.path}`).error(path.error)
    throw createError({ statusCode: 400 })
  }

  const tokenId = path.data.id

  try {
    await useDrizzle()
      .delete(userToken)
      .where(eq(userToken.id, tokenId))

    return 'Token deleted'
  }
  catch (error) {
    if (error instanceof Error) {
      useLogger(`In server route: ${event.path}`).error(error)
      throw createError(error)
    }
  }
})
