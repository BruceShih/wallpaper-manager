<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import type { WallpaperAndTags } from './types'

interface GalleryTableSearchFieldsProps {
  table: Table<WallpaperAndTags>
}

const { table } = defineProps<GalleryTableSearchFieldsProps>()

const store = useTagStore()

const tags = computed(() => store.tags.map(tag => ({
  label: tag.tag.toString(),
  value: tag.id.toString()
})))
const isFiltered = computed(() => table.getState().columnFilters.length > 0)
</script>

<template>
  <div class="flex flex-1 items-center space-x-2">
    <Input
      class="h-8 w-[150px] lg:w-[250px]"
      :model-value="(table.getColumn('key')?.getFilterValue() as string) ?? ''"
      placeholder="Filter wallpapers..."
      @input="table.getColumn('key')?.setFilterValue($event.target.value)"
    />
    <GalleryTableFacetedFilter
      v-if="table.getColumn('tags')"
      :column="table.getColumn('tags')"
      :options="tags"
      title="Tags"
    />

    <Button
      v-if="isFiltered"
      class="h-8 px-2 lg:px-3"
      variant="ghost"
      @click="table.resetColumnFilters()"
    >
      Reset
      <Icon
        class="ml-2 size-4"
        name="lucide:x"
      />
    </Button>
  </div>
</template>
