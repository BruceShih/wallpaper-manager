import { userToken } from '~~/server/database/schema'
import { consola } from 'consola'

export default defineEventHandler(async (event) => {
  const path = await getValidatedRouterParams(event, body => apiTokenPostPathSchema.safeParse(body))
  if (!path.success) {
    consola.error(path.error)
    throw createError({ statusCode: 400 })
  }

  const tokenId = path.data.id

  const body = await readValidatedBody(event, data => apiTokenUpdateBodySchema.safeParse(data))
  if (!body.success) {
    consola.error(body.error)
    throw createError({ statusCode: 400 })
  }

  try {
    await useDrizzle()
      .update(userToken)
      .set({
        enabled: body.data.enabled
      })
      .where(eq(userToken.id, tokenId))

    return 'Token updated'
  }
  catch (error) {
    if (error instanceof Error) {
      consola.error(error)
      throw createError(error)
    }
  }
})
