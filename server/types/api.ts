import { z } from 'zod'

export const apiGetQuerySchema = z.object({
  nsfw: z.enum(['true', 'false']).default('false')
})

export const apiListQuerySchema = z.object({
  size: z.coerce.number().default(20),
  page: z.coerce.number().default(1),
  sort: z.enum(['date', 'name']).default('date'),
  order: z.enum(['asc', 'desc']).default('asc'),
  name: z.string().optional()
})

export const apiUpdateBodySchema = z.object({
  favorite: z.boolean()
})

export const apiUploadPathSchema = z.object({
  id: z.string(),
  nsfw: z.enum(['nsfw', 'sfw']).default('sfw')
})
