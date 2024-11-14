import { z } from 'zod'

/**
 * schema for validates path parameter '/:id' with a minimum length of 1 (which means it's required)
 */
export const apiGenericPathSchema = z.object({
  id: z.string().min(1)
})

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

export const apiTokenDeletePathSchema = z.object({
  id: z.coerce.number()
})

export const apiTokenPostPathSchema = z.object({
  id: z.coerce.number()
})

export const apiTokenUpdateBodySchema = z.object({
  enabled: z.boolean()
})
