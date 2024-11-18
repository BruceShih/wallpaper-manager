import { images, imagesToTags } from '~~/server/database/schema'
import { eq, useDrizzle } from '~~/server/utils/drizzle'
import { apiGenericPathSchema } from '~~/server/utils/validator'

export default eventHandler(async (event) => {
  const path = await getValidatedRouterParams(event, data => apiGenericPathSchema.safeParse(data))
  if (!path.success) {
    throw createError({
      statusCode: 400,
      cause: path.error
    })
  }

  try {
    await hubBlob().del(path.data.id)

    await useDrizzle().transaction(async (tx) => {
      await tx
        .delete(images)
        .where(eq(images.key, path.data.id))
      await tx
        .delete(imagesToTags)
        .where(eq(imagesToTags.imageKey, path.data.id))
    })

    return 'Image deleted'
  }
  catch (error) {
    if (error instanceof Error)
      throw createError(error)
  }
})
