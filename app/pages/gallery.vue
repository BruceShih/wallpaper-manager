<script setup lang="ts">
import { GalleryTable } from '#build/components'
import { columns } from '~/components/Gallery/columns'

if (import.meta.dev) {
  definePageMeta({
    auth: false
  })
}

const store = useWallpaperStore()

onMounted(async () => {
  await store.fetchWallpapers()
  await store.fetchTags()
})
</script>

<template>
  <div class="space-y-4">
    <GalleryTable
      :columns="columns"
      :data="store.wallpapers"
    />
  </div>
</template>
