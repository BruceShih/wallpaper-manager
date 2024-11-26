import { images, imagesToTags } from '~~/server/database/schema'
import { apiImageDeleteBodySchema } from '~~/server/utils/validator'
import { consola } from 'consola'

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, data => apiImageDeleteBodySchema.safeParse(data))
  if (!body.success) {
    consola.withTag(`In server route: ${event.path}`).error(body.error)
    throw createError({ statusCode: 400 })
  }

  try {
    await hubBlob().del(body.data.keys)

    await useDrizzle().batch([
      useDrizzle()
        .delete(imagesToTags)
        .where(inArray(imagesToTags.imageKey, body.data.keys)),
      useDrizzle()
        .delete(images)
        .where(inArray(images.key, body.data.keys))
    ])

    return 'Image(s) deleted'
  }
  catch (error) {
    if (error instanceof Error) {
      consola.withTag(`In server route: ${event.path}`).error(error)
      throw createError(error)
    }
  }
})
