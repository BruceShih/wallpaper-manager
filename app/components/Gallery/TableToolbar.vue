<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import { GalleryTableFacetedFilter, GalleryTableViewOptions } from '#build/components'
import { tags, type WallpaperAndTags } from './types'

interface GalleryTableToolbarProps {
  table: Table<WallpaperAndTags>
}

const props = defineProps<GalleryTableToolbarProps>()

const isFiltered = computed(() => props.table.getState().columnFilters.length > 0)
</script>

<template>
  <div class="flex items-center justify-between">
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
          name="radix-icons:cross-2"
        />
      </Button>
    </div>
    <GalleryTableViewOptions :table="table" />
  </div>
</template>
