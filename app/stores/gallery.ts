import type { Tag } from '~~/server/utils/drizzle'
import { useToast } from '~/components/ui/toast/use-toast'
import { useGalleryAPIs } from '~/composables/useGalleryAPIs'

interface GalleryStoreState {
  tags: Tag[]
}

export const useGalleryStore = defineStore('galleryStore', {
  state: (): GalleryStoreState => ({
    tags: []
  }),
  actions: {
    async fetchTags() {
      const store = useGalleryAPIs()
      const { toast } = useToast()

      const response = await store.fetchTags()

      if (response.error) {
        toast({
          title: 'Failed to fetch tags',
          variant: 'destructive'
        })
      }
      this.tags = response.data.value || []
    }
  }
})
