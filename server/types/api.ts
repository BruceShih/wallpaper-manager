import { z } from 'zod'

export const apiImageGetQuerySchema = z.object({
  nsfw: z.enum(['true', 'false']).default('false')
})

export const apiImageListQuerySchema = z.object({
  size: z.coerce.number().default(20),
  page: z.coerce.number().default(1),
  sort: z.enum(['date', 'name']).default('date'),
  order: z.enum(['asc', 'desc']).default('asc'),
  name: z.string().optional()
})

export const apiImageUpdateBodySchema = z.object({
  favorite: z.boolean()
})

export const apiImageUploadPathSchema = z.object({
  id: z.string(),
  nsfw: z.enum(['nsfw', 'sfw']).default('sfw')
})

export const apiTokenUpdateBodySchema = z.object({
  enabled: z.boolean()
})
