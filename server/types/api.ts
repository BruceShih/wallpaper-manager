import { z } from 'zod'

export const apiGetQuerySchema = z.object({
  nsfw: z.enum(['true', 'false']).default('false')
})

export const apiUpdateBodySchema = z.object({
  favorite: z.boolean()
})

export const apiUploadPathSchema = z.object({
  id: z.string(),
  nsfw: z.enum(['nsfw', 'sfw']).default('sfw')
})
