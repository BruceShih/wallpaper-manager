import type { Image, Tag } from '~~/server/utils/drizzle'

import { z } from 'zod'

type Mapped<T> = {
  [Property in keyof T]: T[Property];
}

export const tags = [
  { value: '1', label: 'nsfw' }
]

type Wallpaper = Mapped<Image> & { tags: Tag[] }

export const wallpaperAndTagsSchema: z.ZodType<Wallpaper> = z.object({
  key: z.string(),
  favorite: z.boolean(),
  alive: z.boolean(),
  createDate: z.string(),
  deleteDate: z.string().nullable(),
  tags: z.object({
    id: z.number(),
    tag: z.string(),
    sensitive: z.boolean(),
    enabled: z.boolean()
  }).array()
})

export type WallpaperAndTags = z.infer<typeof wallpaperAndTagsSchema>

export { default as Table } from './Table.vue'
export { default as TableColumnHeader } from './TableColumnHeader.vue'
export { default as TableFacetedFilter } from './TableFacetedFilter.vue'
export { default as TablePagination } from './TablePagination.vue'
export { default as TableRowActions } from './TableRowActions.vue'
export { default as TableRowLink } from './TableRowLink.vue'
export { default as TableToolbar } from './TableToolbar.vue'
export { default as TableViewOptions } from './TableViewOptions.vue'
