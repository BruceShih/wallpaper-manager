import { images } from '~~/server/database/schema'
import { type Image, useDrizzle } from '~~/server/utils/drizzle'
import { asc, desc, like } from 'drizzle-orm'
import { apiImageListQuerySchema } from '../utils/validator'

export default eventHandler(async (event) => {
  let total = 0
  let list: Image[] = []

  const query = await getValidatedQuery(event, data => apiImageListQuerySchema.safeParse(data))
  if (!query.success) {
    throw createError({
      statusCode: 400,
      cause: query.error
    })
  }

  try {
    if (query.data.name) {
      total = await useDrizzle()
        .$count(images, like(images.key, `%${query.data.name}%`))
      list = await useDrizzle()
        .select()
        .from(images)
        .where(like(images.key, `%${query.data.name}%`))
        .orderBy(() => {
          switch (query.data.sort) {
            case 'date':
              return query.data.order === 'asc' ? asc(images.createDate) : desc(images.createDate)
            case 'name':
              return query.data.order === 'asc' ? asc(images.key) : desc(images.key)
          }
        })
        .limit(query.data.size)
        .offset((query.data.page - 1) * query.data.size)
    }
    else {
      total = await useDrizzle().$count(images)
      list = await useDrizzle()
        .select()
        .from(images)
        .orderBy(() => {
          switch (query.data.sort) {
            case 'date':
              return query.data.order === 'asc' ? asc(images.createDate) : desc(images.createDate)
            case 'name':
              return query.data.order === 'asc' ? asc(images.key) : desc(images.key)
          }
        })
        .limit(query.data.size)
        .offset((query.data.page - 1) * query.data.size)
    }

    setResponseHeaders(event, {
      total
    })

    return list
  }
  catch (error) {
    if (error instanceof Error)
      throw createError(error)
  }
})
