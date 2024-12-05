import { consola } from 'consola'
import { eq } from 'drizzle-orm'
import { tags } from '~~/server/database/schema'
import { useDrizzle } from '~~/server/utils/drizzle'
import { apiTagDeletePathSchema } from '~~/server/utils/validator'

export default defineEventHandler(async (event) => {
  const path = await getValidatedRouterParams(event, data => apiTagDeletePathSchema.safeParse(data))
  if (!path.success) {
    consola.error(path.error)
    throw createError({ statusCode: 400 })
  }

  try {
    await useDrizzle().batch([
      useDrizzle()
        .delete(tags)
        .where(eq(tags.id, path.data.id))
    ])

    return 'Tag(s) deleted'
  }
  catch (error) {
    if (error instanceof Error) {
      consola.error(error)
      throw createError(error)
    }
  }
})
