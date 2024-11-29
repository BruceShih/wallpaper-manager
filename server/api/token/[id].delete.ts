import { consola } from 'consola'
import { eq } from 'drizzle-orm'
import { userToken } from '~~/server/database/schema'
import { useDrizzle } from '~~/server/utils/drizzle'
import { apiTokenDeletePathSchema } from '~~/server/utils/validator'

export default defineEventHandler(async (event) => {
  const path = await getValidatedRouterParams(event, data => apiTokenDeletePathSchema.safeParse(data))
  if (!path.success) {
    consola.error(path.error)
    throw createError({ statusCode: 400 })
  }

  const tokenId = path.data.id

  try {
    await useDrizzle()
      .delete(userToken)
      .where(eq(userToken.id, tokenId))

    return 'Token deleted'
  }
  catch (error) {
    if (error instanceof Error) {
      consola.error(error)
      throw createError(error)
    }
  }
})
