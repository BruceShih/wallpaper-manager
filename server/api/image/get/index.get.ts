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
    const tagsQuery = await useDrizzle()
      .select()
      .from(tags)
      .where(and(
        eq(tags.sensitive, sensitive),
        eq(tags.enabled, true)
      ))
    const selectedTags = tagsQuery.map(tag => tag.id)
    const imagesToTagsQuery = await useDrizzle()
      .selectDistinct()
      .from(imagesToTags)
      .where(inArray(imagesToTags.tagId, selectedTags))
    const imageQuery = await useDrizzle()
      .select()
      .from(images)
      .leftJoin(imagesToTags, eq(images.key, imagesToTags.imageKey))
      .where(and(
        eq(images.alive, true),
        inArray(images.key, imagesToTagsQuery.map(row => row.imageKey))
      ))
      .orderBy(sql`RANDOM()`)
      .limit(1)
    // const imageQuery = await useDrizzle().query.images.findFirst({
    //   where: and(
    //     eq(images.alive, true),
    //     inArray(images.key, imagesToTagsQuery.map(row => row.imageKey))
    //   ),
    //   orderBy: sql`RANDOM()`
    // })

    const randomRow = imageQuery[0]

    if (!randomRow) {
      throw createError({
        statusCode: 404
      })
    }

    const id = randomRow.images.key
    const favorite = randomRow.images.favorite

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
