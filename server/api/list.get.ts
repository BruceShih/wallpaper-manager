import { images, tags } from '~~/server/database/schema'
import { useLogger } from '@nuxt/kit'

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, data => apiImageListQuerySchema.safeParse(data))
  if (!query.success) {
    useLogger(`In server route: ${event.path}`).error(query.error)
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
      useLogger(`In server route: ${event.path}`).error(error)
      throw createError(error)
    }
  }
})
