import { createError, defineEventHandler, getValidatedQuery, setResponseHeaders } from '#imports'
import { images, imagesToTags, tags } from '~~/server/database/schema'
import { asc, desc, eq, inArray, like, useDrizzle } from '~~/server/utils/drizzle'
import { consola } from 'consola'
import { apiImageListQuerySchema } from '../utils/validator'

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, data => apiImageListQuerySchema.safeParse(data))
  if (!query.success) {
    consola.withTag(`In server route: ${event.path}`).error(query.error)
    throw createError({ statusCode: 400 })
  }

  try {
    const imageTotal = await useDrizzle()
      .$count(images, like(images.key, `%${query.data.name}%`))
    const tagList = await useDrizzle().query.tags.findMany({
      where: eq(tags.enabled, true)
    })
    const imageList = await useDrizzle().query.images.findMany({
      where: query.data.name ? like(images.key, `%${query.data.name}%`) : undefined,
      orderBy: () => {
        switch (query.data.sort) {
          case 'date':
            return query.data.order === 'asc' ? asc(images.createDate) : desc(images.createDate)
          case 'name':
            return query.data.order === 'asc' ? asc(images.key) : desc(images.key)
        }
      },
      limit: query.data.size,
      offset: (query.data.page - 1) * query.data.size
    })
    const imagesToTagsList = await useDrizzle().query.imagesToTags.findMany({
      where: inArray(imagesToTags.imageKey, imageList.map(row => row.key))
    })

    const list = imageList.map((row) => {
      const tags = imagesToTagsList
        .filter(imagesToTagsRow => imagesToTagsRow.imageKey === row.key)
        .map(imagesToTagsRow => tagList.find(tagRow => tagRow.id === imagesToTagsRow.tagId))
        .filter(tagRow => tagRow !== undefined)

      return { images: row, tags }
    })

    setResponseHeaders(event, {
      total: imageTotal
    })

    return list
  }
  catch (error) {
    if (error instanceof Error) {
      consola.withTag(`In server route: ${event.path}`).error(error)
      throw createError(error)
    }
  }
})
