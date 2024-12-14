import type { ApiImageGetRandomRequest } from '~~/server/types/api/image'
import type { Image, ImagesToTags, Tag } from '~~/server/types/drizzle'
import consola from 'consola'
import { and, eq, isNull, sql } from 'drizzle-orm'
import { images, imagesToTags, tags } from '~~/server/database/schema'
import { useDrizzle } from '~~/server/types/drizzle'

interface SensitiveImages {
  imagesToTags: ImagesToTags
  tags: Tag | null
  images: Image | null
}
interface InsensitiveImages {
  images: Image
  imagesToTags: ImagesToTags | null
}

export default defineEventHandler<ApiImageGetRandomRequest>(async (event) => {
  const query = await getValidatedQuery(event, data => apiImageGetQuerySchema.safeParse(data))
  if (!query.success) {
    consola.error(query.error)
    throw createError({ statusCode: 400 })
  }

  let imageQuery: InsensitiveImages[] | SensitiveImages[]
  let id: string = ''
  let favorite: boolean = false
  const sensitive = query.data.sensitive === 'true'

  try {
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
      consola.error('No image found')
      throw createError({ statusCode: 404 })
    }

    const requestUrl = getRequestURL(event)
    const requestUrlWithoutQuery = new URL(`${requestUrl.origin}${requestUrl.pathname}/${randomRow.images?.key}`)
    const cache = await caches.open('wallpaper')
    const cachedResponse = await cache.match(requestUrlWithoutQuery)
    if (cachedResponse) {
      consola.info('Cache hit: ', requestUrl)
      sendWebResponse(event, cachedResponse)
    }
    else {
      handleCacheHeaders(event, {
        modifiedTime: randomRow.images?.createDate,
        maxAge: 604800,
        etag: crypto.randomUUID(),
        cacheControls: ['public']
      })

      setResponseHeaders(event, {
        'Image-Id': id,
        'Favorite': favorite.valueOf().toString(),
        'Content-Security-Policy': 'default-src \'none\';'
      })

      const blobResponse = await hubBlob().get(id)
      const response = new Response(blobResponse)

      event.waitUntil(cache.put(requestUrlWithoutQuery, response.clone()))

      sendWebResponse(event, response)
    }
  }
  catch (error) {
    if (error instanceof Error) {
      consola.error(error)
      throw createError(error)
    }
  }
})
