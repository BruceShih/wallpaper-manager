import { images } from "~~/server/database/schema"
import { eq, useDrizzle } from "~~/server/utils/drizzle"

export default eventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    console.error('[Wallpaper Service] Param invalid')
    throw createError({
      statusCode: 400,
      statusMessage: 'Param invalid',
    })
  }

  try {
    // delete image from r2
    await hubBlob().del(id)
    // update database
    await useDrizzle()
      .delete(images)
      .where(
          eq(images.key, id)
      )

    return 'Image deleted'
  } catch (error) {
    console.error('[Wallpaper Service] Server error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Server error',
    })
  }
})
