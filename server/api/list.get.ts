import { images } from '~~/server/database/schema'
import { type Image, useDrizzle } from '~~/server/utils/drizzle'
import { asc, desc, like } from 'drizzle-orm'
import { apiImageListQuerySchema } from '../types/api'

export default eventHandler(async (event) => {
  let total = 0
  let list: Image[] = []

  const result = await getValidatedQuery(event, query => apiImageListQuerySchema.safeParse(query))
  if (!result.success) {
    console.error('[Wallpaper Service] Param invalid')
    throw createError({
      statusCode: 400,
      statusMessage: 'Param invalid'
    })
  }

  try {
    if (result.data.name) {
      total = await useDrizzle()
        .$count(images, like(images.key, `%${result.data.name}%`))
      list = await useDrizzle()
        .select()
        .from(images)
        .where(like(images.key, `%${result.data.name}%`))
        .orderBy(() => {
          switch (result.data.sort) {
            case 'date':
              return result.data.order === 'asc' ? asc(images.createDate) : desc(images.createDate)
            case 'name':
              return result.data.order === 'asc' ? asc(images.key) : desc(images.key)
          }
        })
        .limit(result.data.size)
        .offset((result.data.page - 1) * result.data.size)
    }
    else {
      total = await useDrizzle().$count(images)
      list = await useDrizzle()
        .select()
        .from(images)
        .orderBy(() => {
          switch (result.data.sort) {
            case 'date':
              return result.data.order === 'asc' ? asc(images.createDate) : desc(images.createDate)
            case 'name':
              return result.data.order === 'asc' ? asc(images.key) : desc(images.key)
          }
        })
        .limit(result.data.size)
        .offset((result.data.page - 1) * result.data.size)
    }

    setResponseHeaders(event, {
      total
    })

    return list
  }
  catch (error) {
    console.error('[Wallpaper Service] Server error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Server error'
    })
  }
})
