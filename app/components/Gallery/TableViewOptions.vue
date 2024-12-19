<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import type { WallpaperAndTags } from './types'

interface GalleryTableViewOptionsProps {
  table: Table<WallpaperAndTags>
}

const { table } = defineProps<GalleryTableViewOptionsProps>()
const emits = defineEmits<{
  delete: [void]
}>()
</script>

<template>
  <Button
    v-if="table.getIsSomeRowsSelected()"
    class="ml-auto mr-2 h-8 lg:flex"
    size="sm"
    variant="destructive"
    @click="emits('delete')"
  >
    <Icon
      class="size-4"
      name="radix-icons:trash"
    />
    Delete Selected
  </Button>
</template>
