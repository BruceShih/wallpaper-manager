export default defineEventHandler((event) => {
  if (event.path.startsWith('/api')) {
    const { authKeySecret } = useRuntimeConfig(event)
    const key = getRequestHeader(event, 'X-Bucket-Auth-Key')
    if (key !== authKeySecret) {
      console.error('[Wallpaper Service] Unauthorized')
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }
  }
})
