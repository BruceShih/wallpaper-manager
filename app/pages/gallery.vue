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
    <CustomTable
      :columns="columns"
      :data="wallpaperStore.wallpapers"
    >
      <template #toolbar="{ table }">
        <GalleryTableToolbar :table="table" />
      </template>
    </CustomTable>
  </div>
</template>
