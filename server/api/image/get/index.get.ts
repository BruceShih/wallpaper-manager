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
    const imageQuery = await useDrizzle()
      .select()
      .from(images)
      .leftJoin(imagesToTags, eq(images.key, imagesToTags.imageKey))
      .leftJoin(tags, eq(imagesToTags.tagId, tags.id))
      .where(and(
        eq(images.alive, true),
        eq(tags.enabled, true),
        eq(tags.sensitive, sensitive)
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
