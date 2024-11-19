import { images, imagesToTags } from '~~/server/database/schema'
import { and, eq, inArray, useDrizzle } from '~~/server/utils/drizzle'
import { apiGenericPathSchema, apiImageUpdateBodySchema } from '~~/server/utils/validator'
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

  const body = await readValidatedBody(event, data => apiImageUpdateBodySchema.safeParse(data))
  if (!body.success) {
    consola.error(body.error)
    throw createError({
      statusCode: 400,
      message: body.error.message,
      cause: body.error.cause
    })
  }

  try {
    const favorite = body.data.favorite
    const tags = body.data.tags || []
    const ownedTagsQuery = await useDrizzle()
      .select()
      .from(imagesToTags)
      .where(eq(imagesToTags.imageKey, path.data.id))
    const ownedTags = ownedTagsQuery.map(row => row.tagId)
    const tagsToAdd = tags.filter(tag => !ownedTags.includes(tag))
    const tagsToRemove = ownedTags.filter(tag => !tags.includes(tag))

    await useDrizzle().batch([
      useDrizzle().update(images).set({ favorite }),
      ...tagsToAdd.length > 0
        ? [useDrizzle()
            .insert(imagesToTags)
            .values(tagsToAdd.map(tagId => ({ imageKey: path.data.id, tagId })))]
        : [],
      ...tagsToRemove.length > 0
        ? [useDrizzle()
            .delete(imagesToTags)
            .where(
              and(
                eq(imagesToTags.imageKey, path.data.id),
                inArray(imagesToTags.tagId, tagsToRemove)
              )
            )]
        : []
    ])

    return 'Image updated'
  }
  catch (error) {
    if (error instanceof Error) {
      consola.error(error)
      throw createError(error)
    }
  }
})
