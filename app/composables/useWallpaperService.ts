import type { Tag, UserToken } from '~~/server/utils/drizzle'
import type { WallpaperAndTags } from '~/components/Gallery/types'
import { randBoolean, randFileName, randPastDate, randProductCategory, randUuid } from '@ngneat/falso'

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

export function useWallpaperService() {
  const tag = {
    async get(id: number) {
      if (import.meta.dev) {
        const data = await new Promise<Tag>(
          resolve => resolve(({
            id: 1,
            enabled: true,
            tag: 'nsfw',
            sensitive: true
          }))
        )
        return { data: ref(data), error: null }
      }

      const token = useBearerToken()
      return await useFetch(`/api/tag/get/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    },
    async getMany() {
      if (import.meta.dev) {
        const data = await new Promise<Tag[]>(
          resolve => resolve(Array.from({ length: 50 }, (_, i) => ({
            id: i,
            enabled: randBoolean(),
            tag: randProductCategory(),
            sensitive: randBoolean()
          })))
        )
        return { data: ref(data), error: null }
      }

      const token = useBearerToken()
      return await useFetch('/api/tag/list', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    },
    async create(body: { name: string, sensitive: boolean }) {
      const token = useBearerToken()
      return await useFetch('/api/tag/create', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body
      })
    },
    async delete(id: number) {
      const token = useBearerToken()
      return await useFetch(`/api/tag/delete/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    }
  }
  const wallpaper = {
    async getMany(query?: FetchWallpaperApiArgsType) {
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
    async update(data: UpdateWallpaperApiArgsType) {
      const token = useBearerToken()
      return await useFetch(`/api/image/update/${data.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: data.body
      })
    },
    async upload(data: UploadWallpaperApiArgsType, onSuccess: () => void, onError: () => void) {
      const token = useBearerToken()
      const queryString = data.tags.length > 0 ? `?tags=${data.tags.join('&tags=')}` : ''
      const formData = new FormData()
      formData.append('file', data.body, data.body.name)
      return await useFetch(`/api/image/upload/${data.id}${queryString}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
        onResponse: () => {
          onSuccess()
        },
        onResponseError: () => {
          onError()
        }
      })
    },
    async delete(ids: string[]) {
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
  const token = {
    async getMany() {
      if (import.meta.dev) {
        const data = await new Promise<UserToken[]>(
          resolve => resolve(Array.from({ length: 50 }, (_, i) => ({
            id: i,
            userId: randUuid(),
            token: randUuid(),
            enabled: randBoolean(),
            createDate: randPastDate().toISOString(),
            deleteDate: null
          })))
        )
        return { data: ref(data), error: null }
      }

      const token = useBearerToken()
      return await useFetch('/api/token/list', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    },
    async create() {
      const token = useBearerToken()
      return await useFetch<UserToken[]>('/api/token', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    },
    async update(id: number, enable: boolean) {
      const token = useBearerToken()
      return await useFetch(`/api/token/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ enable })
      })
    },
    async delete(ids: number[]) {
      const token = useBearerToken()
      return await useFetch('/api/token', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ids })
      })
    }
  }
  return { tag, wallpaper, token }
}