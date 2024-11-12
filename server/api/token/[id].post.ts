import { userToken } from '~~/server/database/schema'
import { apiTokenUpdateBodySchema } from '~~/server/types/api'
import { eq, useDrizzle } from '~~/server/utils/drizzle'

export default eventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  let tokenId = 0

  if (!id || Number.isNaN(tokenId)) {
    console.error('[Wallpaper Service] Param invalid')
    throw createError({
      statusCode: 400,
      statusMessage: 'Param invalid'
    })
  }

  tokenId = Number.parseInt(id)

  const result = await readValidatedBody(event, body => apiTokenUpdateBodySchema.safeParse(body))
  if (!result.success) {
    console.error('[Wallpaper Service] Body invalid')
    throw createError({
      statusCode: 400,
      statusMessage: 'Body invalid'
    })
  }

  try {
    await useDrizzle()
      .update(userToken)
      .set({
        enabled: result.data.enabled
      })
      .where(eq(userToken.id, tokenId))

    return 'Token updated'
  }
  catch (error) {
    console.error('[Wallpaper Service] Server error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Server error'
    })
  }
})
