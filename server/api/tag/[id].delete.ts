import type { ApiTagDeleteRequest, ApiTagDeleteResponse } from '~~/server/types/api/tag'
import { consola } from 'consola'
import { eq } from 'drizzle-orm'
import { tags } from '~~/server/database/schema'
import { useDrizzle } from '~~/server/types/drizzle'

export default defineEventHandler<ApiTagDeleteRequest, ApiTagDeleteResponse>(async (event) => {
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
