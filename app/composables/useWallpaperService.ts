import type { ApiImageDeleteResponse, ApiImageListResponse, ApiImageUpdateResponse, ApiImageUploadResponse } from '~~/server/types/api/image'
import type { ApiTagCreateResponse, ApiTagDeleteResponse, ApiTagGetResponse, ApiTagListResponse } from '~~/server/types/api/tag'
import type { ApiTokenCreateResponse, ApiTokenDeleteResponse, ApiTokenListResponse, ApiTokenUpdateResponse } from '~~/server/types/api/token'
import type { Tag, UserToken } from '~~/server/types/drizzle'
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

      return await useFetch<ApiTagGetResponse>(`/api/tag/${id}`)
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

      return await useFetch<ApiTagListResponse>('/api/tag/list')
    },
    async create(body: { name: string, sensitive: boolean }) {
      return await useFetch<ApiTagCreateResponse>('/api/tag', {
        method: 'PUT',
        body
      })
    },
    async delete(id: number) {
      return await useFetch<ApiTagDeleteResponse>(`/api/tag/${id}`, {
        method: 'DELETE'
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

      return await useFetch<ApiImageListResponse>('/api/image/list', {
        query
      })
    },
    async update(data: UpdateWallpaperApiArgsType) {
      return await useFetch<ApiImageUpdateResponse>(`/api/image/${data.id}`, {
        method: 'PATCH',
        body: data.body
      })
    },
    async upload(data: UploadWallpaperApiArgsType, onSuccess: () => void, onError: () => void) {
      const store = useTagStore()
      const tags = data.tags
        .map(tag => store.tags.find(t => t.tag === tag)?.id)
        .filter(Boolean)
      const queryString = tags.length > 0 ? `?tags=${tags.join('&tags=')}` : ''
      const formData = new FormData()
      formData.append('file', data.body, data.body.name)
      return await useFetch<ApiImageUploadResponse>(`/api/image/${data.id}${queryString}`, {
        method: 'PUT',
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
      return await useFetch<ApiImageDeleteResponse>('/api/image/delete', {
        method: 'POST',
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

      return await useFetch<ApiTokenListResponse>('/api/token/list')
    },
    async create() {
      return await useFetch<ApiTokenCreateResponse>('/api/token', {
        method: 'PUT'
      })
    },
    async update(id: number, enable: boolean) {
      return await useFetch<ApiTokenUpdateResponse>(`/api/token/${id}`, {
        method: 'POST',
        body: JSON.stringify({ enable })
      })
    },
    async delete(ids: number[]) {
      return await useFetch<ApiTokenDeleteResponse>('/api/token', {
        method: 'DELETE',
        body: JSON.stringify({ ids })
      })
    }
  }
  return { tag, wallpaper, token }
}
