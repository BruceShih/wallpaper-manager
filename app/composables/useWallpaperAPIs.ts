import type { Tag } from '~~/server/utils/drizzle'
import type { WallpaperAndTags } from '~/components/Gallery'
import { randBoolean, randFileName, randPastDate } from '@ngneat/falso'

export interface FetchWallpaperApiArgsType {
  page: number
  size: number
  name: string
  sort: 'date' | 'name'
  order: 'asc' | 'desc'
}

export interface UpdateWallpaperApiArgsType {
  id: string
  body: { favorite: boolean, tags?: number[] }
}

export interface UploadWallpaperApiArgsType {
  id: string
  tags: string[]
  body: File
}

export function useWallpaperAPIs() {
  const methods = {
    async fetchWallpapers(query?: FetchWallpaperApiArgsType) {
      if (import.meta.dev) {
        const data = await new Promise<WallpaperAndTags[]>(
          resolve => resolve(Array.from({ length: 500 }, (_, _i) => ({
            key: randFileName(),
            favorite: randBoolean(),
            alive: randBoolean(),
            createDate: randPastDate().toISOString(),
            deleteDate: null,
            tags: Array.from({ length: Math.floor(Math.random() * 2) }, (_, _j) => ({
              id: 1,
              enabled: true,
              tag: 'nsfw',
              sensitive: true
            }))
          })))
        )
        return { data: ref(data), error: null }
      }

      const token = useBearerToken()
      return await useFetch('/api/list', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        query
      })
    },
    async fetchTags() {
      if (import.meta.dev) {
        const data = await new Promise<Tag[]>(
          resolve => resolve(([{
            id: 1,
            enabled: true,
            tag: 'nsfw',
            sensitive: true
          }]))
        )
        return { data: ref(data), error: null }
      }

      const token = useBearerToken()
      return await useFetch('/api/tags/list', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    },
    async updateWallpaper(args: UpdateWallpaperApiArgsType) {
      const token = useBearerToken()
      return await useFetch(`/api/image/update/${args.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: args.body
      })
    },
    async uploadWallpaper(args: UploadWallpaperApiArgsType) {
      const token = useBearerToken()
      const queryString = args.tags.length > 0 ? `?tags=${args.tags.join('&tags=')}` : ''
      const formData = new FormData()
      formData.append('file', args.body, args.body.name)
      return useFetch(`/api/image/upload/${args.id}${queryString}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      })
    },
    async deleteWallpapers(ids: string[]) {
      const token = useBearerToken()
      return await useFetch('/api/image/delete', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: { keys: ids }
      })
    }
  }
  return methods
}
