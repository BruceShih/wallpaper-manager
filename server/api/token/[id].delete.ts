import { userToken } from '~~/server/database/schema'
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

  try {
    await useDrizzle()
      .delete(userToken)
      .where(eq(userToken.id, tokenId))

    return 'Token deleted'
  }
  catch (error) {
    console.error('[Wallpaper Service] Server error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Server error'
    })
  }
})
