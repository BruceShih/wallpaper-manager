import { images } from "~~/server/database/schema"
import { apiUpdateBodySchema } from "~~/server/types/api"
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

  const result = await readValidatedBody(event, body => apiUpdateBodySchema.safeParse(body))
  if (!result.success) {
    console.error('[Wallpaper Service] Body invalid')
    throw createError({
      statusCode: 400,
      statusMessage: 'Body invalid',
    })
  }

  try {
    // get request body
    const favorite = result.data.favorite
    // preparing sql statement
    await useDrizzle()
      .update(images)
      .set({ favorite: favorite ? 1 : 0 })
      .where(
          eq(images.key, id)
      )

    return 'Image marked as favorite'
  } catch (error) {
    console.error('[Wallpaper Service] Server error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Server error',
    })
  }
})
