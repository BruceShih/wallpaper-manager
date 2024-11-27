import { randBoolean, randFileName, randPastDate } from '@ngneat/falso'
import type { WallpaperAndTags } from '~/components/Gallery'

export function useGalleryAPIs() {
  const methods = {
    async fetchWallpapers(query?: {
      page: number
      size: number
      name: string
      sort: 'date' | 'name'
      order: 'asc' | 'desc'
    }) {
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
        return { data: ref(data) }
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
          resolve => resolve(Array.from({ length: Math.floor(Math.random() * 2) }, (_, _j) => ({
            id: 1,
            enabled: true,
            tag: 'nsfw',
            sensitive: true
          })))
        )
        return { data: ref(data) }
      }

      const token = useBearerToken()
      return await useFetch('/api/tags/list', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    },
    async updateWallpaper(id: string, body: { favorite: boolean, tags?: number[] }) {
      const token = useBearerToken()
      return await useFetch(`/api/image/update/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body
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
