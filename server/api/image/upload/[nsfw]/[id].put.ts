import { images } from '~~/server/database/schema'
import { apiImageUploadPathSchema } from '~~/server/types/api'
import { eq, tables, useDrizzle } from '~~/server/utils/drizzle'

export default eventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    console.error('[Wallpaper Service] Param invalid')
    throw createError({
      statusCode: 400,
      statusMessage: 'Param invalid'
    })
  }

  const result = await getValidatedRouterParams(event, param => apiImageUploadPathSchema.safeParse(param))
  if (!result.success) {
    console.error('[Wallpaper Service] Param invalid')
    throw createError({
      statusCode: 400,
      statusMessage: 'Param invalid'
    })
  }

  const isNsfw = result.data.nsfw === 'nsfw' ? 1 : 0

  try {
    // check image existence
    const query = await useDrizzle()
      .select()
      .from(tables.images)
      .where(
        eq(images.key, id)
      )

    const row = query[0]

    if (row) {
      console.warn('[Wallpaper Service] Image existed, skip uploading', row.key)
      setResponseStatus(event, 202, 'Image existed')
      return 'Image existed'
    }

    // upload image to bucket
    const file = await readRawBody(event)
    if (!file) {
      console.error('[Wallpaper Service] No file provided')
      throw createError({
        statusCode: 400,
        statusMessage: 'No file provided'
      })
    }

    await hubBlob().put(id, file)

    // write to database
    await useDrizzle()
      .insert(images)
      .values({ key: id, nsfw: isNsfw, createDate: new Date().toISOString(), deleteDate: '' })

    setResponseStatus(event, 201, 'Image uploaded')
    return 'Image uploaded'
  }
  catch (error) {
    await hubBlob().del(id)

    console.error('[Wallpaper Service] Server error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Server error'
    })
  }
})
