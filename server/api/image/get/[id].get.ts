import { images } from '~~/server/database/schema'
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
    const imageQuery = await useDrizzle().query.images.findFirst({
      where: eq(images.key, path.data.id)
    })

    const row = imageQuery

    if (!row) {
      console.error('[Wallpaper Service] No image found')
      throw createError({
        statusCode: 404
      })
    }

    const favorite = row.favorite

    setResponseHeaders(event, {
      'Image-Id': path.data.id,
      'Favorite': favorite.valueOf().toString(),
      'ETag': crypto.randomUUID()
    })

    return hubBlob().serve(event, path.data.id)
  }
  catch (error) {
    if (error instanceof Error)
      throw createError(error)
  }
})
