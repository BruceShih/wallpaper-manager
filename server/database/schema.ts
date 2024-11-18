import { relations } from 'drizzle-orm'
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const images = sqliteTable('images', {
  key: text('key').primaryKey(),
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
  sensitive: integer({ mode: 'boolean' }).notNull().default(false),
  enabled: integer({ mode: 'boolean' }).notNull().default(true)
})

export const imagesToTags = sqliteTable(
  'imagesToTags',
  {
    imageKey: text('imageKey')
      .notNull()
      .references(() => images.key),
    tagId: integer('tagId')
      .notNull()
      .references(() => tags.id)
  },
  t => ({
    pk: primaryKey({ columns: [t.imageKey, t.tagId] })
  })
)

export const imagesToTagsRelations = relations(imagesToTags, ({ one }) => ({
  image: one(images, {
    fields: [imagesToTags.imageKey],
    references: [images.key]
  }),
  tag: one(tags, {
    fields: [imagesToTags.tagId],
    references: [tags.id]
  })
}))
