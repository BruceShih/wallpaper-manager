import { images } from '~~/server/database/schema'
import { eq, useDrizzle } from '~~/server/utils/drizzle'
import { apiGenericPathSchema, apiImageUpdateBodySchema } from '~~/server/utils/validator'

export default eventHandler(async (event) => {
  const path = await getValidatedRouterParams(event, data => apiGenericPathSchema.safeParse(data))
  if (!path.success) {
    throw createError({
      statusCode: 400,
      cause: path.error
    })
  }

  const body = await readValidatedBody(event, data => apiImageUpdateBodySchema.safeParse(data))
  if (!body.success) {
    throw createError({
      statusCode: 400,
      cause: body.error
    })
  }

  try {
    const favorite = body.data.favorite
    await useDrizzle()
      .update(images)
      .set({ favorite })
      .where(
        eq(images.key, path.data.id)
      )

    return 'Image marked as favorite'
  }
  catch (error) {
    if (error instanceof Error)
      throw createError(error)
  }
})
