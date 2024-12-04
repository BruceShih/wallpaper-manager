import type { WallpaperAndTags } from '~/components/Gallery/types'
import { useToast } from '~/components/ui/toast/use-toast'
import { useWallpaperService } from '~/composables/useWallpaperService'

interface WallpaperStoreState {
  wallpapers: WallpaperAndTags[]
}

export const useWallpaperStore = defineStore('wallpaperStore', {
  state: (): WallpaperStoreState => ({
    wallpapers: []
  }),
  actions: {
    async fetchWallpapers(query?: {
      page: number
      size: number
      name: string
      sort: 'date' | 'name'
      order: 'asc' | 'desc'
    }) {
      const api = useWallpaperService()
      const { toast } = useToast()

      const response = await api.wallpaper.getMany(query)
      if (response.error?.value) {
        toast({
          title: 'Failed to fetch wallpapers',
          variant: 'destructive'
        })
      }
      this.wallpapers = response.data.value || []
    },
    async updateWallpaper(data: UpdateWallpaperApiArgsType) {
      const store = useTagStore()
      const api = useWallpaperService()
      const { toast } = useToast()

      const { error } = await api.wallpaper.update({ id: data.id, body: data.body })
      if (error.value) {
        toast({
          title: 'Failed to update wallpaper',
          variant: 'destructive'
        })
      }
      else {
        const wallpaper = this.wallpapers.find(w => w.key === data.id)
        if (wallpaper) {
          wallpaper.favorite = data.body.favorite
          wallpaper.tags = []
          wallpaper.tags = store.tags.filter(t => data.body.tags?.includes(t.id))
        }

        toast({
          title: 'Wallpaper updated',
          variant: 'default'
        })
      }
    },
    async deleteWallpapers(keys: string[]) {
      const api = useWallpaperService()
      const { toast } = useToast()

      const { error } = await api.wallpaper.delete(keys)
      if (error.value) {
        toast({
          title: 'Failed to delete wallpaper(s)',
          variant: 'destructive'
        })
      }
      else {
        this.wallpapers = this.wallpapers.filter(
          wallpaper => !keys.includes(wallpaper.key)
        )
        toast({
          title: 'Wallpaper(s) deleted',
          variant: 'default'
        })
      }
    },
    async uploadWallpaper(data: UploadWallpaperApiArgsType, onSuccess: () => void, onError: () => void) {
      const api = useWallpaperService()
      return await api.wallpaper.upload(data, onSuccess, onError)
    }
  }
})
