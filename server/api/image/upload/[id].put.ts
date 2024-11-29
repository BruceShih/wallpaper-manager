import { consola } from 'consola'
import { eq } from 'drizzle-orm'
import { images, imagesToTags } from '~~/server/database/schema'
import { tables, useDrizzle } from '~~/server/utils/drizzle'
import { apiImageUploadPathSchema, apiImageUploadQuerySchema } from '~~/server/utils/validator'

export default defineEventHandler(async (event) => {
  const path = await getValidatedRouterParams(event, data => apiImageUploadPathSchema.safeParse(data))
  if (!path.success) {
    consola.error(path.error)
    throw createError({ statusCode: 400 })
  }

  const query = await getValidatedQuery(event, data => apiImageUploadQuerySchema.safeParse(data))
  if (!query.success) {
    consola.error(query.error)
    throw createError({ statusCode: 400 })
  }

  const tags = query.data.tags ? [...[query.data?.tags]].flat() : []

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

    const file = await readRawBody(event, 'binary')
    if (!file) {
      consola.error('No file attached')
      throw createError({ statusCode: 400 })
    }

    await hubBlob().put(path.data.id, file, { contentType: 'image/jpeg' })

    await useDrizzle().batch([
      useDrizzle()
        .insert(images)
        .values({ key: path.data.id, createDate: new Date().toISOString(), deleteDate: '' }),
      ...tags.length > 0
        ? [useDrizzle()
            .insert(imagesToTags)
            .values(tags.map(tagId => ({ imageKey: path.data.id, tagId })))]
        : []
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
