<script setup lang="ts">
import { Table as GalleryTable } from '~/components/Gallery'
import { columns } from '~/components/Gallery/columns'

const store = useGalleryStore()

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
