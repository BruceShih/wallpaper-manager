export default defineEventHandler(async (event) => {
  if (event.path.startsWith('/api/image')) {
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
