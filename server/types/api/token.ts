import type { EventHandlerRequest, EventHandlerResponse } from 'h3'
import type z from 'zod'
import type { UserToken } from '../drizzle'

// POST: /api/token/{id}
export interface ApiTokenUpdateRequest extends EventHandlerRequest {
  body: z.infer<typeof apiTokenUpdateBodySchema>
  routerParams: z.infer<typeof apiGenericPathSchema>
}
export type ApiTokenUpdateResponse = EventHandlerResponse<string | undefined>

// DELETE: /api/token
export interface ApiTokenDeleteRequest extends EventHandlerRequest {
  body: z.infer<typeof apiTokenDeleteBodySchema>
}
export type ApiTokenDeleteResponse = EventHandlerResponse<string | undefined>

// PUT: /api/token
export type ApiTokenCreateResponse = EventHandlerResponse<UserToken[] | undefined>

// GET: /api/token/list
export type ApiTokenListResponse = EventHandlerResponse<UserToken[] | undefined>
