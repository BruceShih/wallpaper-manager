import { images } from '~~/server/database/schema'
import { eq, tables, useDrizzle } from '~~/server/utils/drizzle'
import { apiGenericPathSchema } from '~~/server/utils/validator'

export default eventHandler(async (event) => {
  let favorite = false

  const path = await getValidatedRouterParams(event, data => apiGenericPathSchema.safeParse(data))
  if (!path.success) {
    throw createError({
      statusCode: 400,
      cause: path.error
    })
  }

  try {
    const query = await useDrizzle()
      .select()
      .from(tables.images)
      .where(
        eq(images.key, path.data.id)
      )

    const row = query[0]

    if (!row) {
      console.error('[Wallpaper Service] No image found')
      throw createError({
        statusCode: 404
      })
    }

    favorite = row.favorite

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
