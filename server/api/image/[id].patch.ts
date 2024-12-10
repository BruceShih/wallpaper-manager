import type { ApiImageUpdateRequest, ApiImageUpdateResponse } from '~~/server/types/api/image'
import { consola } from 'consola'
import { and, eq, inArray } from 'drizzle-orm'
import { images, imagesToTags } from '~~/server/database/schema'
import { useDrizzle } from '~~/server/types/drizzle'

export default defineEventHandler<ApiImageUpdateRequest, ApiImageUpdateResponse>(async (event) => {
  const path = await getValidatedRouterParams(event, data => apiGenericPathSchema.safeParse(data))
  if (!path.success) {
    consola.error(path.error)
    throw createError({ statusCode: 400 })
  }

  const body = await readValidatedBody(event, data => apiImageUpdateBodySchema.safeParse(data))
  if (!body.success) {
    consola.error(body.error)
    throw createError({ statusCode: 400 })
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
      useDrizzle().update(images).set({ favorite }).where(eq(images.key, path.data.id)),
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
