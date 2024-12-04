<script setup lang="ts">
import { columns } from '~/components/Gallery/columns'

if (import.meta.dev) {
  definePageMeta({
    auth: false
  })
}

const wallpaperStore = useWallpaperStore()
const tagStore = useTagStore()

onMounted(async () => {
  await wallpaperStore.fetchWallpapers()
  await tagStore.fetchTags()
})
</script>

<template>
  <div class="space-y-4">
    <GalleryTable
      :columns="columns"
      :data="wallpaperStore.wallpapers"
    />
  </div>
</template>
