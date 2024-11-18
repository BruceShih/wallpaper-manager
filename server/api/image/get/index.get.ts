import { images, imagesToTags, tags } from '~~/server/database/schema'
import { and, eq, sql, useDrizzle } from '~~/server/utils/drizzle'
import { apiImageGetQuerySchema } from '~~/server/utils/validator'
import { inArray } from 'drizzle-orm'

export default eventHandler(async (event) => {
  const query = await getValidatedQuery(event, data => apiImageGetQuerySchema.safeParse(data))
  if (!query.success) {
    throw createError({
      statusCode: 400,
      cause: query.error
    })
  }

  const filterTags = query.data.tags || []
  const sensitive = query.data.sensitive

  try {
    const imageQuery = await useDrizzle().query.images.findFirst({
      with: {
        imagesToTags: {
          where: filterTags.length > 0 ? inArray(imagesToTags.tagId, filterTags) : undefined
        },
        tags: {
          where: eq(tags.sensitive, sensitive)
        }
      },
      where: eq(images.alive, true),
      orderBy: sql`RANDOM()`
    })

    const randomRow = imageQuery

    if (!randomRow) {
      throw createError({
        statusCode: 404
      })
    }

    const id = randomRow.key
    const favorite = randomRow.favorite

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
