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

  try {
    const sensitive = query.data.sensitive ? query.data.sensitive : false
    const tagsQuery = await useDrizzle().query.tags.findMany({
      where: and(
        eq(tags.sensitive, sensitive),
        eq(tags.enabled, true)
      )
    })
    const filterTags = query.data.tags ? query.data.tags : []
    const selectedTags = tagsQuery.map(tag => tag.id)
    const set = new Set([...selectedTags, ...filterTags])
    const imagesToTagsQuery = await useDrizzle().query.imagesToTags.findMany({
      where: inArray(imagesToTags.tagId, Array.from(set))
    })
    const imageQuery = await useDrizzle().query.images.findFirst({
      where: and(
        eq(images.alive, true),
        inArray(images.key, imagesToTagsQuery.map(row => row.imageKey))
      ),
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
