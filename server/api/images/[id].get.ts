import { apiGenericPathSchema } from '~~/server/utils/validator'

export default eventHandler(async (event) => {
  const path = await getValidatedRouterParams(event, data => apiGenericPathSchema.safeParse(data))
  if (!path.success) {
    throw createError({
      statusCode: 400,
      cause: path.error
    })
  }

  try {
    return hubBlob().serve(event, path.data.id)
  }
  catch (error) {
    if (error instanceof Error)
      throw createError(error)
  }
})
