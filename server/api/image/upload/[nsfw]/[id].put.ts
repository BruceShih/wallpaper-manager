import { images } from '~~/server/database/schema'
import { eq, tables, useDrizzle } from '~~/server/utils/drizzle'
import { apiImageUploadPathSchema } from '~~/server/utils/validator'

export default eventHandler(async (event) => {
  const path = await getValidatedRouterParams(event, data => apiImageUploadPathSchema.safeParse(data))
  if (!path.success) {
    throw createError({
      statusCode: 400,
      cause: path.error
    })
  }

  const isNsfw = path.data.nsfw === 'nsfw'

  try {
    const query = await useDrizzle()
      .select()
      .from(tables.images)
      .where(
        eq(images.key, path.data.id)
      )

    const row = query[0]

    if (row) {
      setResponseStatus(event, 202, 'Image existed')
      return 'Image existed'
    }

    const file = await readRawBody(event)
    if (!file) {
      throw createError({
        statusCode: 400,
        cause: 'No file attached'
      })
    }

    await hubBlob().put(path.data.id, file)

    await useDrizzle()
      .insert(images)
      .values({ key: path.data.id, nsfw: isNsfw, createDate: new Date().toISOString(), deleteDate: '' })

    setResponseStatus(event, 201, 'Image uploaded')
    return 'Image uploaded'
  }
  catch (error) {
    await hubBlob().del(path.data.id)

    if (error instanceof Error)
      throw createError(error)
  }
})
