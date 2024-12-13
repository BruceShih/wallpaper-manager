import type { ApiTokenDeleteRequest, ApiTokenDeleteResponse } from '~~/server/types/api/token'
import { consola } from 'consola'
import { userToken } from '~~/server/database/schema'
import { inArray, useDrizzle } from '~~/server/types/drizzle'

export default defineEventHandler<ApiTokenDeleteRequest, ApiTokenDeleteResponse>(async (event) => {
  const body = await readValidatedBody(event, data => apiTokenDeleteBodySchema.safeParse(data))
  if (!body.success) {
    consola.error(body.error)
    throw createError({ statusCode: 400 })
  }

  const tokenIds = body.data.ids

  try {
    await useDrizzle()
      .delete(userToken)
      .where(inArray(userToken.id, tokenIds))

    return 'Token deleted'
  }
  catch (error) {
    if (error instanceof Error) {
      consola.error(error)
      throw createError(error)
    }
  }
})
