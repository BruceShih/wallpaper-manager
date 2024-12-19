<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import type { WallpaperAndTags } from '~/components/Gallery/types'
import { columns } from '~/components/Gallery/columns'

if (import.meta.dev) {
  definePageMeta({
    auth: false
  })
}

useHead({
  title: 'Gallery - Wallpaper Manager'
})

const wallpaperStore = useWallpaperStore()
const tagStore = useTagStore()

async function onDelete(table: Table<WallpaperAndTags>) {
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const wallpaperKeys = selectedRows.map(row => row.original.key)
  await wallpaperStore.deleteWallpapers(wallpaperKeys)
  table.resetRowSelection()
}

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
        <GalleryTableToolbar :table="table">
          <template #search>
            <GalleryTableSearchFields :table="table" />
          </template>
          <template #options>
            <GalleryTableViewOptions
              :table="table"
              @delete="onDelete(table)"
            />
          </template>
        </GalleryTableToolbar>
      </template>
    </CustomTable>
  </div>
</template>
