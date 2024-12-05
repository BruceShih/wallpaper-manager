import { consola } from 'consola'
import { tables, useDrizzle } from '~~/server/utils/drizzle'
import { apiTagCreateBodySchema } from '~~/server/utils/validator'

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, data => apiTagCreateBodySchema.safeParse(data))
  if (!body.success) {
    consola.error(body.error)
    throw createError({ statusCode: 400 })
  }

  try {
    const tag = await useDrizzle()
      .insert(tables.tags)
      .values({ tag: body.data.name, sensitive: body.data.sensitive })
      .returning()

    return tag
  }
  catch (error) {
    if (error instanceof Error) {
      consola.error(error)
      throw createError(error)
    }
  }
})
