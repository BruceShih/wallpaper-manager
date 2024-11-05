import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const images = sqliteTable('images', {
  key: text('key').primaryKey(),
  nsfw: integer('nsfw').notNull().default(0),
  favorite: integer('favorite').notNull().default(0),
  alive: integer('alive').notNull().default(1),
  createDate: text('createDate').notNull(),
  deleteDate: text('deleteDate')
})
