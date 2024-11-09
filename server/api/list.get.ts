import { images } from '~~/server/database/schema'
import { type Image, tables, useDrizzle } from '~~/server/utils/drizzle'
import { asc, count } from 'drizzle-orm'
import { apiListQuerySchema } from '../types/api'

export default eventHandler(async (event) => {
  let total = 0
  let list: Image[] = []

  const result = await getValidatedQuery(event, query => apiListQuerySchema.safeParse(query))
  if (!result.success) {
    console.error('[Wallpaper Service] Param invalid')
    throw createError({
      statusCode: 400,
      statusMessage: 'Param invalid'
    })
  }

  try {
    const totalQuery = await useDrizzle()
      .select({ total: count(images.key) })
      .from(tables.images)

    total = totalQuery[0]?.total || 0

    const query = await useDrizzle()
      .select()
      .from(tables.images)
      .orderBy(asc(images.createDate))
      .limit(result.data.size)
      .offset((result.data.page - 1) * result.data.size)

    list = query

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
