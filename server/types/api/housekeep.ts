import type { EventHandlerRequest, EventHandlerResponse } from 'h3'
import type z from 'zod'
import type { apiHouseKeepQuerySchema } from '~~/server/utils/validator'
import type { Image, Tag } from '../drizzle'

// GET: /api/housekeep
export interface ApiHouseKeepRequest extends EventHandlerRequest {
  query: z.infer<typeof apiHouseKeepQuerySchema>
}
export type ApiHouseKeepResponse = EventHandlerResponse<string | undefined>
