import type { Tag } from '~~/server/utils/drizzle'
import type { WallpaperAndTags } from '~/components/Gallery'
import { useToast } from '~/components/ui/toast/use-toast'
import { useGalleryAPIs } from '~/composables/useGalleryAPIs'

interface GalleryStoreState {
  wallpapers: WallpaperAndTags[]
  tags: Tag[]
}

export const useGalleryStore = defineStore('galleryStore', {
  state: (): GalleryStoreState => ({
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
      const store = useGalleryAPIs()
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
      const store = useGalleryAPIs()
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
