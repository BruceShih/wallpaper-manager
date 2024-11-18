import { drizzle } from 'drizzle-orm/d1'

import * as schema from '../database/schema'

export { and, asc, desc, eq, inArray, isNull, like, ne, notExists, or, sql } from 'drizzle-orm'

export const tables = schema

export function useDrizzle() {
  return drizzle(hubDatabase(), { schema })
}

export type Image = typeof schema.images.$inferSelect
export type UserToken = typeof schema.userToken.$inferSelect
export type Tag = typeof schema.tags.$inferSelect
export type ImagesToTags = typeof schema.imagesToTags.$inferSelect
