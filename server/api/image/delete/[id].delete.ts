import { images, imagesToTags } from '~~/server/database/schema'
import { eq, useDrizzle } from '~~/server/utils/drizzle'
import { apiGenericPathSchema } from '~~/server/utils/validator'
import { consola } from 'consola'

export default eventHandler(async (event) => {
  const path = await getValidatedRouterParams(event, data => apiGenericPathSchema.safeParse(data))
  if (!path.success) {
    consola.error(path.error)
    throw createError({
      statusCode: 400,
      message: path.error.message,
      cause: path.error.cause
    })
  }

  try {
    await hubBlob().del(path.data.id)

    await useDrizzle().batch([
      useDrizzle()
        .delete(imagesToTags)
        .where(eq(imagesToTags.imageKey, path.data.id)),
      useDrizzle()
        .delete(images)
        .where(eq(images.key, path.data.id))
    ])

    return 'Image deleted'
  }
  catch (error) {
    if (error instanceof Error) {
      consola.error(error)
      throw createError(error)
    }
  }
})
