import type { Tag } from '~~/server/utils/drizzle'
import type { WallpaperAndTags } from '~/components/Gallery'
import { randBoolean, randFileName, randPastDate } from '@ngneat/falso'

export function useWallpaperAPIs() {
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
    async updateWallpaper(id: string, body: { favorite: boolean, tags?: number[] }) {
      const token = useBearerToken()
      return await useFetch(`/api/image/update/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body
      })
    },
    async uploadWallpaper(id: string, tags: string[], body: File) {
      const token = useBearerToken()
      const queryString = tags.length > 0 ? `?tags=${tags.join('&tags=')}` : ''
      const upload = useUpload(`/api/image/upload/${id}${queryString}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const formData = new FormData()
      formData.append('file', new Blob([body], { type: body.type }), body.name)
      return await upload(body)
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
