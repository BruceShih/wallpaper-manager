import { useLogger } from '@nuxt/kit'

export default defineEventHandler(async (event) => {
  try {
    const list = await useDrizzle().query.tags.findMany()
    return list
  }
  catch (error) {
    if (error instanceof Error) {
      useLogger(`In server route: ${event.path}`).error(error)
      throw createError(error)
    }
  }
})
