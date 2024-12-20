import type { Image, Tag } from '~~/server/types/drizzle'

import { z } from 'zod'

type Mapped<T> = {
  [Property in keyof T]: T[Property];
}

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
