export function useGalleryAPIs() {
  const methods = {
    async fetchWallpapers(query?: {
      page: number
      size: number
      name: string
      sort: 'date' | 'name'
      order: 'asc' | 'desc'
    }) {
      const token = useBearerToken()

      const { data, error } = await useFetch('/api/list', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        query
      })
      return { data, error }
    },
    async fetchTags() {
      const token = useBearerToken()

      const { data, error } = await useFetch('/api/tags/list', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return { data, error }
    },
    async updateWallpaper(id: string, body: { favorite: boolean, tags?: number[] }) {
      const token = useBearerToken()

      const { error } = await useFetch(`/api/image/update/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body
      })
      return { error }
    },
    async deleteWallpaper(id: string) {
      const token = useBearerToken()

      const { error } = await useFetch(`/api/image/delete/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return { error }
    }
  }
  return methods
}
