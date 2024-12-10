import type { Tag } from '~~/server/types/drizzle'
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
      this.tags = response.data.value
    },
    async deleteTag(id: number) {
      const api = useWallpaperService()
      const { toast } = useToast()

      const { error } = await api.tag.delete(id)
      if (error.value) {
        toast({
          title: 'Failed to delete tag',
          variant: 'destructive'
        })
      }
      else {
        this.tags = this.tags.filter(tag => tag.id !== id)
      }
    },
    async createTag(body: { name: string, sensitive: boolean }) {
      const api = useWallpaperService()
      const { toast } = useToast()

      const { data, error } = await api.tag.create(body)
      if (error.value) {
        toast({
          title: 'Failed to create new tag',
          variant: 'destructive'
        })
      }
      else {
        if (data.value) {
          for (const tag of data.value) {
            this.tags.push(tag)
          }
        }
      }
    }
  }
})
