import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const images = sqliteTable('images', {
  key: text('key').primaryKey(),
  tags: text('tags', { mode: 'json' }).$type<number[]>().notNull(),
  nsfw: integer({ mode: 'boolean' }).notNull().default(false),
  favorite: integer({ mode: 'boolean' }).notNull().default(false),
  alive: integer({ mode: 'boolean' }).notNull().default(true),
  createDate: text('createDate').notNull(),
  deleteDate: text('deleteDate')
})

export const userToken = sqliteTable('userToken', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  userId: text('userId').notNull(),
  token: text('token').notNull(),
  enabled: integer({ mode: 'boolean' }).notNull().default(false),
  createDate: text('createDate').notNull(),
  deleteDate: text('deleteDate')
})

export const tags = sqliteTable('tags', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  tag: text('tag').notNull(),
  enabled: integer({ mode: 'boolean' }).notNull().default(true)
})
