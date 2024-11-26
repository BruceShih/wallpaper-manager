import { images } from '~~/server/database/schema'
import { useLogger } from 'nuxt/kit'

export default defineEventHandler(async (event) => {
  const path = await getValidatedRouterParams(event, data => apiGenericPathSchema.safeParse(data))
  if (!path.success) {
    useLogger(`In server route: ${event.path}`).error(path.error)
    throw createError({ statusCode: 400 })
  }

  try {
    const imageQuery = await useDrizzle().query.images.findFirst({
      where: eq(images.key, path.data.id)
    })

    const row = imageQuery

    if (!row) {
      useLogger(`In server route: ${event.path}`).error('No image found')
      throw createError({ statusCode: 404 })
    }

    const favorite = row.favorite

    setResponseHeaders(event, {
      'Image-Id': path.data.id,
      'Favorite': favorite.valueOf().toString(),
      'ETag': crypto.randomUUID()
    })

    return hubBlob().serve(event, path.data.id)
  }
  catch (error) {
    if (error instanceof Error) {
      useLogger(`In server route: ${event.path}`).error(error)
      throw createError(error)
    }
  }
})
