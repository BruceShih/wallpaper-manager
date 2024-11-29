import { consola } from 'consola'
import { inArray } from 'drizzle-orm'
import { images, imagesToTags } from '~~/server/database/schema'
import { useDrizzle } from '~~/server/utils/drizzle'
import { apiImageDeleteBodySchema } from '~~/server/utils/validator'

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, data => apiImageDeleteBodySchema.safeParse(data))
  if (!body.success) {
    consola.error(body.error)
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
      consola.error(error)
      throw createError(error)
    }
  }
})
