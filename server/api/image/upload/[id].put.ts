import type { ImagesToTags } from '~~/server/utils/drizzle'
import { images, imagesToTags } from '~~/server/database/schema'
import { eq, tables, useDrizzle } from '~~/server/utils/drizzle'
import { apiImageUploadPathSchema, apiImageUploadQuerySchema } from '~~/server/utils/validator'
import { consola } from 'consola'

export default eventHandler(async (event) => {
  const path = await getValidatedRouterParams(event, data => apiImageUploadPathSchema.safeParse(data))
  if (!path.success) {
    consola.error(path.error)
    throw createError({
      statusCode: 400,
      message: path.error.message,
      cause: path.error.cause
    })
  }

  const query = await getValidatedQuery(event, data => apiImageUploadQuerySchema.safeParse(data))
  if (!query.success) {
    consola.error(query.error)
    throw createError({
      statusCode: 400,
      message: query.error.message,
      cause: query.error.cause
    })
  }

  const tags = query.data.tags || []
  const imagesToTagsRows = tags.map(tagId => ({ imageKey: path.data.id, tagId }))

  try {
    const imageQuery = await useDrizzle()
      .select()
      .from(tables.images)
      .where(
        eq(images.key, path.data.id)
      )

    const row = imageQuery[0]

    if (row) {
      setResponseStatus(event, 202, 'Image existed')
      return 'Image existed'
    }

    const file = await readRawBody(event)
    if (!file) {
      consola.error('No file attached')
      throw createError({
        statusCode: 400,
        message: 'No file attached'
      })
    }

    await hubBlob().put(path.data.id, file)

    await useDrizzle().batch([
      useDrizzle()
        .insert(images)
        .values({ key: path.data.id, createDate: new Date().toISOString(), deleteDate: '' }),
      useDrizzle()
        .insert(imagesToTags)
        .values([{} as ImagesToTags, ...imagesToTagsRows])
    ])

    setResponseStatus(event, 201, 'Image uploaded')
    return 'Image uploaded'
  }
  catch (error) {
    await hubBlob().del(path.data.id)

    if (error instanceof Error) {
      consola.error(error)
      throw createError(error)
    }
  }
})