import { userToken } from '~~/server/database/schema'
import { eq, useDrizzle } from '~~/server/utils/drizzle'
import { apiTokenDeletePathSchema } from '~~/server/utils/validator'

export default eventHandler(async (event) => {
  const path = await getValidatedRouterParams(event, data => apiTokenDeletePathSchema.safeParse(data))
  if (!path.success) {
    throw createError({
      statusCode: 400,
      message: path.error.message,
      cause: path.error.cause
    })
  }

  const tokenId = path.data.id

  try {
    await useDrizzle()
      .delete(userToken)
      .where(eq(userToken.id, tokenId))

    return 'Token deleted'
  }
  catch (error) {
    if (error instanceof Error)
      throw createError(error)
  }
})
