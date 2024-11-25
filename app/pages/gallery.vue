<script setup lang="ts">
import type { WallpaperAndTags } from '~/components/Gallery'
import { columns } from '~/components/Gallery/columns'
import { useToast } from '~/components/ui/toast/use-toast'
import { useGalleryAPIs } from '~/composables/useGalleryAPIs'

const store = useGalleryStore()
const api = useGalleryAPIs()
const { toast } = useToast()

const wallpapers = ref<WallpaperAndTags[]>([])

onMounted(async () => {
  const { data, error } = await api.fetchWallpapers()
  if (error.value) {
    toast({
      title: 'Failed to fetch wallpapers',
      variant: 'destructive'
    })
  }
  else {
    wallpapers.value = data.value || []
  }

  await store.fetchTags()
})
</script>

<template>
  <div class="space-y-4">
    <GalleryTable
      :columns="columns"
      :data="wallpapers"
    />
  </div>
</template>
