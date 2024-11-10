export default defineEventHandler(async (event) => {
  const paths = ['/api/delete', '/api/list', '/api/get', '/api/update', '/api/upload']

  if (paths.some(path => event.path.startsWith(path))) {
    const session = await serverAuth().api.getSession({
      headers: event.headers
    })

    if (!session) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }
  }
})
