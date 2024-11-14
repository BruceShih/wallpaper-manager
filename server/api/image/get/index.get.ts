import { images } from '~~/server/database/schema'
import { and, eq, type Image, sql, tables, useDrizzle } from '~~/server/utils/drizzle'
import { apiImageGetQuerySchema } from '~~/server/utils/validator'

export default eventHandler(async (event) => {
  let id = ''
  let favorite = false
  let randomRow: Image | undefined

  const query = await getValidatedQuery(event, data => apiImageGetQuerySchema.safeParse(data))
  if (!query.success) {
    throw createError({
      statusCode: 400,
      cause: query.error
    })
  }

  const nsfw = query.data.nsfw === 'true'

  try {
    const query = await useDrizzle()
      .select()
      .from(tables.images)
      .where(
        and(
          eq(images.alive, true),
          eq(images.nsfw, nsfw)
        )
      )
      .orderBy(sql`RANDOM()`)
      .limit(1)

    randomRow = query[0]

    if (!randomRow) {
      throw createError({
        statusCode: 404
      })
    }

    id = randomRow.key
    favorite = randomRow.favorite

    setResponseHeaders(event, {
      'Image-Id': id,
      'Favorite': favorite.valueOf().toString()
    })

    return hubBlob().serve(event, id)
  }
  catch (error) {
    if (error instanceof Error)
      throw createError(error)
  }
})
