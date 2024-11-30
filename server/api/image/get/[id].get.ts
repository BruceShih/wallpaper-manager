import { consola } from 'consola'
import { eq } from 'drizzle-orm'
import { images } from '~~/server/database/schema'
import { useDrizzle } from '~~/server/utils/drizzle'
import { apiGenericPathSchema } from '~~/server/utils/validator'

export default defineEventHandler(async (event) => {
  const path = await getValidatedRouterParams(event, data => apiGenericPathSchema.safeParse(data))
  if (!path.success) {
    consola.error(path.error)
    throw createError({ statusCode: 400 })
  }

  try {
    const imageQuery = await useDrizzle().query.images.findFirst({
      where: eq(images.key, path.data.id)
    })

    const row = imageQuery

    if (!row) {
      consola.error('No image found')
      throw createError({ statusCode: 404 })
    }

    const favorite = row.favorite

    setResponseHeaders(event, {
      'Image-Id': path.data.id,
      'Favorite': favorite.valueOf().toString(),
      'ETag': crypto.randomUUID(),
      'Cache-Control': 'public, max-age=604800',
      'Content-Security-Policy': 'default-src \'none\';'
    })

    return hubBlob().serve(event, path.data.id)
  }
  catch (error) {
    if (error instanceof Error) {
      consola.error(error)
      throw createError(error)
    }
  }
})
