import type { EventHandlerRequest, EventHandlerResponse } from 'h3'
import type z from 'zod'
import type { apiHousekeepingQuerySchema } from '~~/server/utils/validator'

// GET: /api/housekeeping
export interface ApiHousekeepingRequest extends EventHandlerRequest {
  query: z.infer<typeof apiHousekeepingQuerySchema>
}
export type ApiHousekeepingResponse = EventHandlerResponse<string | undefined>
