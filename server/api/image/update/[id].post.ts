import { images, imagesToTags } from '~~/server/database/schema'
import { and, eq, inArray, useDrizzle } from '~~/server/utils/drizzle'
import { apiGenericPathSchema, apiImageUpdateBodySchema } from '~~/server/utils/validator'

export default eventHandler(async (event) => {
  const path = await getValidatedRouterParams(event, data => apiGenericPathSchema.safeParse(data))
  if (!path.success) {
    throw createError({
      statusCode: 400,
      cause: path.error
    })
  }

  const body = await readValidatedBody(event, data => apiImageUpdateBodySchema.safeParse(data))
  if (!body.success) {
    throw createError({
      statusCode: 400,
      cause: body.error
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
    if (error instanceof Error)
      throw createError(error)
  }
})
