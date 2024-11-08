import { z } from 'zod'

export const apiGetQuerySchema = z.object({
  nsfw: z.enum(['true', 'false']).default('false')
})

export const apiListQuerySchema = z.object({
  size: z.coerce.number().default(20),
  page: z.coerce.number().default(1)
})

export const apiUpdateBodySchema = z.object({
  favorite: z.boolean()
})

export const apiUploadPathSchema = z.object({
  id: z.string(),
  nsfw: z.enum(['nsfw', 'sfw']).default('sfw')
})
