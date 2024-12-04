import { consola } from 'consola'
import { inArray } from 'drizzle-orm'
import { tags } from '~~/server/database/schema'
import { useDrizzle } from '~~/server/utils/drizzle'
import { apiTagDeleteBodySchema } from '~~/server/utils/validator'

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, data => apiTagDeleteBodySchema.safeParse(data))
  if (!body.success) {
    consola.error(body.error)
    throw createError({ statusCode: 400 })
  }

  try {
    await useDrizzle().batch([
      useDrizzle()
        .delete(tags)
        .where(inArray(tags.id, body.data.ids))
    ])

    return 'Tag(s) deleted'
  }
  catch (error) {
    if (error instanceof Error) {
      consola.error(error)
      throw createError(error)
    }
  }
})
