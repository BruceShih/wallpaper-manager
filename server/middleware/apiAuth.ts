import process from 'node:process'

export default defineEventHandler((event) => {
  const url = new URL(event.headers.get('referer') || '')

  // check if the request origin is the same as the API Gateway domain
  if (url.origin !== process.env.ORIGIN) {
    const paths = ['/api/delete', '/api/list', '/api/get', '/api/update', '/api/upload']
    // if event.path starts with any of paths above
    if (paths.some(path => event.path.startsWith(path))) {
    // get authKeySecret from runtime config
      const { authKeySecret } = useRuntimeConfig(event)
      // get key from request header
      const key = getRequestHeader(event, 'X-Bucket-Auth-Key')
      // if key is not equal to authKeySecret
      if (key !== authKeySecret) {
      // log unauthorized
        console.error('[Wallpaper Service] Unauthorized')
        // throw error
        throw createError({
          statusCode: 401,
          message: 'Unauthorized'
        })
      }
    }
  }
})
