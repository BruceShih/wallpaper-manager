import type { EventHandlerRequest, EventHandlerResponse } from 'h3'
import type z from 'zod'
import type { Tag } from '../drizzle'

// DELETE: /api/tag/{id}
export interface ApiTagDeleteRequest extends EventHandlerRequest {
  routerParams: z.infer<typeof apiGenericPathSchema>
}
export type ApiTagDeleteResponse = EventHandlerResponse<string | undefined>

// GET: /api/tag/{id}
export interface ApiTagGetRequest extends EventHandlerRequest {
  routerParams: z.infer<typeof apiGenericPathSchema>
}
export type ApiTagGetResponse = EventHandlerResponse<Tag | undefined>

// PUT: /api/tag
export interface ApiTagCreateRequest extends EventHandlerRequest {
  body: z.infer<typeof apiTagCreateBodySchema>
}
export type ApiTagCreateResponse = EventHandlerResponse<Tag[] | undefined>

// GET: /api/tag/list
export type ApiTagListResponse = EventHandlerResponse<Tag[] | undefined>
