import process from 'node:process'

export default defineEventHandler((event) => {
  const paths = ['/api/delete', '/api/list', '/api/get', '/api/update', '/api/upload']
  const referer = event.headers.get('referer')

  if (paths.some(path => event.path.startsWith(path))) {
    if (referer) {
      if (new URL(referer).origin !== process.env.ORIGIN) {
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
    }
  }
})
