import type { Tag } from '~~/server/utils/drizzle'
import type { WallpaperAndTags } from '~/components/Gallery'
import { useToast } from '~/components/ui/toast/use-toast'
import { useWallpaperAPIs } from '~/composables/useWallpaperAPIs'

interface WallpaperStoreState {
  wallpapers: WallpaperAndTags[]
  tags: Tag[]
}

export const useWallpaperStore = defineStore('galleryStore', {
  state: (): WallpaperStoreState => ({
    wallpapers: [],
    tags: []
  }),
  actions: {
    async fetchWallpapers(query?: {
      page: number
      size: number
      name: string
      sort: 'date' | 'name'
      order: 'asc' | 'desc'
    }) {
      const store = useWallpaperAPIs()
      const { toast } = useToast()

      const response = await store.fetchWallpapers(query)

      if (response.error?.value) {
        toast({
          title: 'Failed to fetch wallpapers',
          variant: 'destructive'
        })
      }
      this.wallpapers = response.data.value || []
    },
    async fetchTags() {
      const store = useWallpaperAPIs()
      const { toast } = useToast()

      const response = await store.fetchTags()

      if (response.error?.value) {
        toast({
          title: 'Failed to fetch tags',
          variant: 'destructive'
        })
      }
      this.tags = response.data.value || []
    }
  }
})
