import { consola } from 'consola'
import { useDrizzle } from '~~/server/utils/drizzle'

export default defineEventHandler(async (_event) => {
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
