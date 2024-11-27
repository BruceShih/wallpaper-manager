import { consola } from 'consola'

export default defineEventHandler(async (event) => {
  const path = await getValidatedRouterParams(event, data => apiGenericPathSchema.safeParse(data))
  if (!path.success) {
    consola.error(path.error)
    throw createError({ statusCode: 400 })
  }

  try {
    return hubBlob().serve(event, path.data.id)
  }
  catch (error) {
    if (error instanceof Error) {
      consola.error(error)
      throw createError(error)
    }
  }
})
