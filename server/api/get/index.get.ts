import { images } from '~~/server/database/schema'
import { apiGetQuerySchema } from '~~/server/types/api'
import { and, eq, type Image, sql, tables, useDrizzle } from '~~/server/utils/drizzle'

export default eventHandler(async (event) => {
  let id = ''
  let favorite = false
  let randomRow: Image | undefined

  const result = await getValidatedQuery(event, query => apiGetQuerySchema.safeParse(query))
  if (!result.success) {
    console.error('[Wallpaper Service] Param invalid')
    throw createError({
      statusCode: 400,
      statusMessage: 'Param invalid'
    })
  }

  const nsfw = result.data.nsfw === 'true' ? 1 : 0

  try {
    const query = await useDrizzle()
      .select()
      .from(tables.images)
      .where(
        and(
          eq(images.alive, 1),
          eq(images.nsfw, nsfw)
        )
      )
      .orderBy(sql`RANDOM()`)
      .limit(1)

    randomRow = query[0]

    if (!randomRow) {
      console.error('[Wallpaper Service] No image found')
      throw createError({
        statusCode: 404,
        statusMessage: 'No image found'
      })
    }

    id = randomRow.key
    favorite = randomRow.favorite === 1

    setResponseHeaders(event, {
      'Image-Id': id,
      'Favorite': favorite.valueOf().toString()
    })

    return hubBlob().serve(event, `images/${id}`)
  }
  catch (error) {
    console.error('[Wallpaper Service] Server error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Server error'
    })
  }
})
