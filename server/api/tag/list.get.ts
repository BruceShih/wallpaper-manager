import type { ApiTagListResponse } from '~~/server/types/api/tag'
import consola from 'consola'
import { useDrizzle } from '~~/server/types/drizzle'

export default defineEventHandler<unknown, ApiTagListResponse>(async (_event) => {
  try {
    const list = await useDrizzle().query.tags.findMany()
    return list
  }
  catch (error) {
    if (error instanceof Error) {
      consola.error(error)
      throw createError(error)
    }
  }
})
