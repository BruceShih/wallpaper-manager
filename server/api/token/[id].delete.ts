import { userToken } from '~~/server/database/schema'
import { useDrizzle } from '~~/server/utils/drizzle'
import { apiTokenDeletePathSchema } from '~~/server/utils/validator'
import { eq } from 'drizzle-orm'

export default eventHandler(async (event) => {
  const path = await getValidatedRouterParams(event, data => apiTokenDeletePathSchema.safeParse(data))
  if (!path.success) {
    throw createError({
      statusCode: 400,
      cause: path.error
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
