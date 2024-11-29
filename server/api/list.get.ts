import { consola } from 'consola'
import { eq, like } from 'drizzle-orm'
import { images, tags } from '~~/server/database/schema'
import { useDrizzle } from '../utils/drizzle'
import { apiImageListQuerySchema } from '../utils/validator'

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, data => apiImageListQuerySchema.safeParse(data))
  if (!query.success) {
    consola.error(query.error)
    throw createError({ statusCode: 400 })
  }

  try {
    const imageTotal = await useDrizzle()
      .$count(images, like(images.key, `%${query.data.name}%`))
    const tagList = await useDrizzle().query.tags.findMany({
      where: eq(tags.enabled, true)
    })
    const imageList = await useDrizzle().query.images.findMany({
      where: query.data.name ? like(images.key, `%${query.data.name}%`) : undefined
    })
    const imagesToTagsList = await useDrizzle().query.imagesToTags.findMany()

    const list = imageList.map((row) => {
      const tags = imagesToTagsList
        .filter(imagesToTagsRow => imagesToTagsRow.imageKey === row.key)
        .map(imagesToTagsRow => tagList.find(tagRow => tagRow.id === imagesToTagsRow.tagId))
        .filter(tagRow => tagRow !== undefined)

      return {
        key: row.key,
        favorite: row.favorite,
        alive: row.alive,
        createDate: row.createDate,
        deleteDate: row.deleteDate,
        tags
      }
    })

    setResponseHeaders(event, {
      total: imageTotal
    })

    return list
  }
  catch (error) {
    if (error instanceof Error) {
      consola.error(error)
      throw createError(error)
    }
  }
})
