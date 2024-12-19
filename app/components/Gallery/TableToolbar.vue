<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import type { WallpaperAndTags } from './types'

interface GalleryTableToolbarProps {
  table: Table<WallpaperAndTags>
}

defineProps<GalleryTableToolbarProps>()
</script>

<template>
  <div class="flex items-center justify-between">
    <slot name="search" />
    <slot name="options" />
  </div>
</template>
