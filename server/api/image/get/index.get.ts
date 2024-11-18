import { images, imagesToTags, tags } from '~~/server/database/schema'
import { and, eq, type ImagesToTags, notExists, sql, useDrizzle } from '~~/server/utils/drizzle'
import { apiImageGetQuerySchema } from '~~/server/utils/validator'

interface SensitiveImages { imagesToTags: ImagesToTags, tags: Tag | null, images: Image | null }

export default eventHandler(async (event) => {
  const query = await getValidatedQuery(event, data => apiImageGetQuerySchema.safeParse(data))
  if (!query.success) {
    throw createError({
      statusCode: 400,
      cause: query.error
    })
  }

  let imageQuery: Image[] | SensitiveImages[]
  let id: string = ''
  let favorite: boolean = false

  try {
    const sensitive = query.data.sensitive
    if (sensitive) {
      imageQuery = await useDrizzle()
        .select()
        .from(imagesToTags)
        .leftJoin(tags, eq(imagesToTags.tagId, tags.id))
        .leftJoin(images, eq(imagesToTags.imageKey, images.key))
        .where(and(
          eq(images.alive, true),
          eq(tags.enabled, true),
          eq(tags.sensitive, sensitive)
        ))
        .orderBy(sql`RANDOM()`)
        .limit(1)

      id = imageQuery[0]?.images?.key || ''
      favorite = imageQuery[0]?.images?.favorite || false
    }
    else {
      const imagesToTagsQuery = useDrizzle()
        .select()
        .from(imagesToTags)
      imageQuery = await useDrizzle()
        .select()
        .from(images)
        .where(and(
          notExists(imagesToTagsQuery),
          eq(images.alive, true)
        ))
        .orderBy(sql`RANDOM()`)
        .limit(1)

      id = imageQuery[0].key
      favorite = imageQuery[0].favorite
    }

    const randomRow = imageQuery[0]

    if (!randomRow) {
      throw createError({
        statusCode: 404
      })
    }

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
