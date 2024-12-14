import type { ApiImageGetRequest } from '~~/server/types/api/image'
import consola from 'consola'
import { eq } from 'drizzle-orm'
import { images } from '~~/server/database/schema'
import { useDrizzle } from '~~/server/types/drizzle'

export default defineEventHandler<ApiImageGetRequest>(async (event) => {
  const path = await getValidatedRouterParams(event, data => apiGenericPathSchema.safeParse(data))
  if (!path.success) {
    consola.error(path.error)
    throw createError({ statusCode: 400 })
  }

  try {
    const requestUrl = getRequestURL(event)
    const cache = await caches.open('wallpaper')
    const cachedResponse = await cache.match(requestUrl)
    if (cachedResponse) {
      consola.info('Cache hit: ', requestUrl)
      sendWebResponse(event, cachedResponse)
    }
    else {
      const imageQuery = await useDrizzle().query.images.findFirst({
        where: eq(images.key, path.data.id)
      })

      const row = imageQuery
      if (!row) {
        consola.error('No image found')
        throw createError({ statusCode: 404 })
      }

      const favorite = row.favorite

      handleCacheHeaders(event, {
        modifiedTime: row.createDate,
        maxAge: 604800,
        etag: crypto.randomUUID(),
        cacheControls: ['public']
      })

      setResponseHeaders(event, {
        'Image-Id': path.data.id,
        'Favorite': favorite.valueOf().toString(),
        'Content-Security-Policy': 'default-src \'none\';'
      })

      const blobResponse = await hubBlob().get(path.data.id)
      const response = new Response(blobResponse)

      event.waitUntil(cache.put(requestUrl, response.clone()))

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
