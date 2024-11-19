import { images, imagesToTags } from '~~/server/database/schema'
import { eq, tables, useDrizzle } from '~~/server/utils/drizzle'
import { apiImageUploadPathSchema, apiImageUploadQuerySchema } from '~~/server/utils/validator'
import { consola } from 'consola'

export default eventHandler(async (event) => {
  const path = await getValidatedRouterParams(event, data => apiImageUploadPathSchema.safeParse(data))
  if (!path.success) {
    consola.withTag(`In server route: ${event.path}`).error(path.error)
    throw createError({ statusCode: 400 })
  }

  const query = await getValidatedQuery(event, data => apiImageUploadQuerySchema.safeParse(data))
  if (!query.success) {
    consola.withTag(`In server route: ${event.path}`).error(query.error)
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

    const file = await readRawBody(event)
    if (!file) {
      consola.withTag(`In server route: ${event.path}`).error('No file attached')
      throw createError({ statusCode: 400 })
    }

    await hubBlob().put(path.data.id, file)

    await useDrizzle().batch([
      useDrizzle()
        .insert(images)
        .values({ key: path.data.id, createDate: new Date().toISOString(), deleteDate: '' }),
      useDrizzle()
        .insert(imagesToTags)
        .values(tags.map(tagId => ({ imageKey: path.data.id, tagId })))
    ])

    setResponseStatus(event, 201, 'Image uploaded')
    return 'Image uploaded'
  }
  catch (error) {
    await hubBlob().del(path.data.id)

    if (error instanceof Error) {
      consola.withTag(`In server route: ${event.path}`).error(error)
      throw createError(error)
    }
  }
})
