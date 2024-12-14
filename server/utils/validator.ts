import { z } from 'zod'

export const apiGenericPathSchema = z.object({
  id: z.string().min(1)
})

export const apiImageGetQuerySchema = z.object({
  sensitive: z.enum(['true', 'false']).default('false')
})

export const apiImageListQuerySchema = z.object({
  size: z.coerce.number().default(20).optional(),
  page: z.coerce.number().default(1).optional(),
  sort: z.enum(['date', 'name']).default('date').optional(),
  order: z.enum(['asc', 'desc']).default('asc').optional(),
  name: z.string().optional()
})

export const apiImageDeleteBodySchema = z.object({
  keys: z.array(z.string().min(1))
})

export const apiImageUpdateBodySchema = z.object({
  favorite: z.boolean(),
  tags: z.array(z.number()).optional()
})

export const apiImageUploadPathSchema = z.object({
  id: z.string()
})

export const apiImageUploadQuerySchema = z.object({
  tags: z.array(z.coerce.number()).or(z.coerce.number()).optional()
})

export const apiTokenDeleteBodySchema = z.object({
  ids: z.array(z.number())
})

export const apiTokenPostPathSchema = z.object({
  id: z.coerce.number()
})

export const apiTokenUpdateBodySchema = z.object({
  enabled: z.boolean()
})

export const apiTagCreateBodySchema = z.object({
  name: z.string().min(1),
  sensitive: z.boolean().default(false)
})

export const apiTagDeletePathSchema = z.object({
  id: z.coerce.number()
})

export const apiTagGetPathSchema = z.object({
  id: z.coerce.number()
})

export const apiHousekeepingQuerySchema = z.object({
  dry: z.coerce.boolean().default(false)
})
