import type { Tag, UserToken } from '~~/server/utils/drizzle'
import type { WallpaperAndTags } from '~/components/Gallery/types'
import { useToast } from '~/components/ui/toast/use-toast'
import { useWallpaperService } from '~/composables/useWallpaperService'

interface WallpaperStoreState {
  wallpapers: WallpaperAndTags[]
  tags: Tag[]
  tokens: UserToken[]
}

export const useWallpaperStore = defineStore('galleryStore', {
  state: (): WallpaperStoreState => ({
    wallpapers: [],
    tags: [],
    tokens: []
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
    async fetchTags() {
      const api = useWallpaperService()
      const { toast } = useToast()

      const response = await api.tag.getMany()

      if (response.error?.value) {
        toast({
          title: 'Failed to fetch tags',
          variant: 'destructive'
        })
      }
      this.tags = response.data.value || []
    },
    async fetchTokens() {
      const api = useWallpaperService()
      const { toast } = useToast()

      const response = await api.token.getMany()

      if (response.error?.value) {
        toast({
          title: 'Failed to fetch tokens',
          variant: 'destructive'
        })
      }
      this.tokens = response.data.value || []
    }
  }
})
