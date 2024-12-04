import type { Tag } from '~~/server/utils/drizzle'
import { useToast } from '~/components/ui/toast/use-toast'
import { useWallpaperService } from '~/composables/useWallpaperService'

interface TagStoreState {
  tags: Tag[]
}

export const useTagStore = defineStore('tagStore', {
  state: (): TagStoreState => ({
    tags: []
  }),
  actions: {
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
    }
  }
})
