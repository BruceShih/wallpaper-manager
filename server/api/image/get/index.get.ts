import { images, imagesToTags, tags } from '~~/server/database/schema'
import { and, eq, type ImagesToTags, isNull, sql, useDrizzle } from '~~/server/utils/drizzle'
import { apiImageGetQuerySchema } from '~~/server/utils/validator'
import { consola } from 'consola'

interface SensitiveImages { imagesToTags: ImagesToTags, tags: Tag | null, images: Image | null }
interface InsensitiveImages { images: Image, imagesToTags: ImagesToTags | null }

export default eventHandler(async (event) => {
  const query = await getValidatedQuery(event, data => apiImageGetQuerySchema.safeParse(data))
  if (!query.success) {
    consola.error(query.error)
    throw createError({
      statusCode: 400,
      message: query.error.message,
      cause: query.error.cause
    })
  }

  let imageQuery: InsensitiveImages[] | SensitiveImages[]
  let id: string = ''
  let favorite: boolean = false

  try {
    const sensitive = query.data.sensitive === 'true'

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
      imageQuery = await useDrizzle()
        .select()
        .from(images)
        .leftJoin(imagesToTags, eq(images.key, imagesToTags.imageKey))
        .where(and(
          isNull(imagesToTags.imageKey),
          eq(images.alive, true)
        ))
        .orderBy(sql`RANDOM()`)
        .limit(1)

      id = imageQuery[0]?.images.key || ''
      favorite = imageQuery[0]?.images.favorite || false
    }

    const randomRow = imageQuery[0]

    if (!randomRow) {
      consola.error('[Wallpaper Service] No image found')
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
    if (error instanceof Error) {
      consola.error(error)
      throw createError(error)
    }
  }
})
