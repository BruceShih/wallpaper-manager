import { images } from '~~/server/database/schema'
import { eq, tables, useDrizzle } from '~~/server/utils/drizzle'

export default eventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  let favorite = false

  if (!id) {
    console.error('[Wallpaper Service] Param invalid')
    throw createError({
      statusCode: 400,
      statusMessage: 'Param invalid'
    })
  }

  try {
    const query = await useDrizzle()
      .select()
      .from(tables.images)
      .where(
        eq(images.key, id)
      )

    const row = query[0]

    if (!row) {
      console.error('[Wallpaper Service] No image found')
      throw createError({
        statusCode: 404,
        statusMessage: 'No image found'
      })
    }

    favorite = row.favorite === 1

    setResponseHeaders(event, {
      'Image-Id': id,
      'Favorite': favorite.valueOf().toString(),
      'ETag': crypto.randomUUID()
    })

    return hubBlob().serve(event, id)
  }
  catch (error) {
    console.error('[Wallpaper Service] Server error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Server error'
    })
  }
})
