import { z } from 'zod'

export const apiGenericPathSchema = z.object({
  id: z.string().min(1)
})

export const apiImageGetQuerySchema = z.object({
  sensitive: z.enum(['true', 'false']).default('false')
})

export const apiImageListQuerySchema = z.object({
  size: z.coerce.number().default(20),
  page: z.coerce.number().default(1),
  sort: z.enum(['date', 'name']).default('date'),
  order: z.enum(['asc', 'desc']).default('asc'),
  name: z.string().optional()
})

export const apiImageUpdateBodySchema = z.object({
  favorite: z.boolean(),
  tags: z.array(z.number()).optional()
})

export const apiImageUploadPathSchema = z.object({
  id: z.string()
})

export const apiImageUploadQuerySchema = z.object({
  tags: z.array(z.coerce.number()).optional()
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
