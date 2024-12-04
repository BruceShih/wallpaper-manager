import { consola } from 'consola'
import { inArray } from 'drizzle-orm'
import { userToken } from '~~/server/database/schema'
import { useDrizzle } from '~~/server/utils/drizzle'
import { apiTokenDeleteBodySchema } from '~~/server/utils/validator'

export default defineEventHandler(async (event) => {
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
