import type { UserToken } from '~~/server/types/drizzle'
import { useToast } from '~/components/ui/toast/use-toast'
import { useWallpaperService } from '~/composables/useWallpaperService'

interface TokenStoreState {
  tokens: UserToken[]
}

export const useTokenStore = defineStore('tokenStore', {
  state: (): TokenStoreState => ({
    tokens: []
  }),
  actions: {
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
    },
    async createToken() {
      const api = useWallpaperService()
      const { toast } = useToast()

      const { data, error } = await api.token.create()
      if (error.value) {
        toast({
          title: 'Failed to create token',
          variant: 'destructive'
        })
      }
      else {
        if (data.value) {
          for (const token of data.value)
            this.tokens.push(token)
        }

        toast({
          title: 'Token created'
        })
      }
    },
    async deleteTokens(ids: number[]) {
      const api = useWallpaperService()
      const { toast } = useToast()

      const { error } = await api.token.delete(ids)
      if (error.value) {
        toast({
          title: 'Failed to delete token',
          variant: 'destructive'
        })
      }
      else {
        this.tokens = this.tokens.filter(token => !ids.includes(token.id))

        toast({
          title: 'Token deleted'
        })
      }
    },
    async updateToken(id: number, enable: boolean) {
      const api = useWallpaperService()
      const { toast } = useToast()

      const { error } = await api.token.update(id, enable)
      if (error.value) {
        toast({
          title: 'Failed to update token',
          variant: 'destructive'
        })
      }
      else {
        const token = this.tokens.find(t => t.id === id)
        if (token)
          token.enabled = enable

        toast({
          title: 'Token updated'
        })
      }
    }
  }
})
