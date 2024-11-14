import { userToken } from '~~/server/database/schema'
import { eq, useDrizzle } from '~~/server/utils/drizzle'
import { apiTokenPostPathSchema, apiTokenUpdateBodySchema } from '~~/server/utils/validator'

export default eventHandler(async (event) => {
  const path = await getValidatedRouterParams(event, body => apiTokenPostPathSchema.safeParse(body))
  if (!path.success) {
    throw createError({
      statusCode: 400,
      cause: path.error
    })
  }

  const tokenId = path.data.id

  const body = await readValidatedBody(event, data => apiTokenUpdateBodySchema.safeParse(data))
  if (!body.success) {
    throw createError({
      statusCode: 400,
      cause: body.error
    })
  }

  try {
    await useDrizzle()
      .update(userToken)
      .set({
        enabled: body.data.enabled
      })
      .where(eq(userToken.id, tokenId))

    return 'Token updated'
  }
  catch (error) {
    if (error instanceof Error)
      throw createError(error)
  }
})
