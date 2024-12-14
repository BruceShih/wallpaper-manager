import type { ApiTagGetRequest, ApiTagGetResponse } from '~~/server/types/api/tag'
import consola from 'consola'
import { eq } from 'drizzle-orm'
import { tags } from '~~/server/database/schema'
import { useDrizzle } from '~~/server/types/drizzle'

export default defineEventHandler<ApiTagGetRequest, ApiTagGetResponse>(async (event) => {
  const path = await getValidatedRouterParams(event, data => apiTagGetPathSchema.safeParse(data))
  if (!path.success) {
    consola.error(path.error)
    throw createError({ statusCode: 400 })
  }

  try {
    const tag = await useDrizzle().query.tags.findFirst({
      where: eq(tags.id, path.data.id)
    })

    return tag
  }
  catch (error) {
    if (error instanceof Error) {
      consola.error(error)
      throw createError(error)
    }
  }
})
