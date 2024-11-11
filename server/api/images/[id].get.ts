export default eventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    console.error('[Wallpaper Service] Param invalid')
    throw createError({
      statusCode: 400,
      statusMessage: 'Param invalid'
    })
  }

  try {
    return hubBlob().serve(event, id)
  }
  catch (error) {
    console.error('[Wallpaper Service] Server error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Server error'
    })
  }
})
