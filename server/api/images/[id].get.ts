import { apiGenericPathSchema } from '~~/server/utils/validator'
import { consola } from 'consola'

export default eventHandler(async (event) => {
  const path = await getValidatedRouterParams(event, data => apiGenericPathSchema.safeParse(data))
  if (!path.success) {
    consola.error(path.error)
    throw createError({
      statusCode: 400,
      message: path.error.message,
      cause: path.error.cause
    })
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
