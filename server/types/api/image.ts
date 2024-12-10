import type { EventHandlerRequest, EventHandlerResponse } from 'h3'
import type z from 'zod'
import type { Image, Tag } from '../drizzle'

// DELETE: /api/image/delete
export interface ApiImageDeleteRequest extends EventHandlerRequest {
  body: z.infer<typeof apiImageDeleteBodySchema>
}
export type ApiImageDeleteResponse = EventHandlerResponse<string | undefined>

// GET: /api/image/{id}
export interface ApiImageGetRequest extends EventHandlerRequest {
  routerParams: z.infer<typeof apiGenericPathSchema>
}

// PATCH: /api/image
export interface ApiImageUpdateRequest extends EventHandlerRequest {
  body: z.infer<typeof apiImageUpdateBodySchema>
  routerParams: z.infer<typeof apiGenericPathSchema>
}
export type ApiImageUpdateResponse = EventHandlerResponse<string | undefined>

// PUT: /api/image
export interface ApiImageUploadRequest extends EventHandlerRequest {
  query: z.infer<typeof apiImageUploadQuerySchema>
  routerParams: z.infer<typeof apiImageUploadPathSchema>
}
export type ApiImageUploadResponse = EventHandlerResponse<string | undefined>

// GET: /api/image
export interface ApiImageGetRandomRequest extends EventHandlerRequest {
  query?: z.infer<typeof apiImageGetQuerySchema>
}

// GET: /api/image/list
export interface ApiImageListRequest extends EventHandlerRequest {
  query: z.infer<typeof apiImageListQuerySchema>
}
type ApiImageListResponseData = Image & { tags: Tag[] }
export type ApiImageListResponse = EventHandlerResponse<ApiImageListResponseData[] | undefined>
