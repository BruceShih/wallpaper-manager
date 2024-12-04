<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import type { WallpaperAndTags } from './types'

interface GalleryTableViewOptionsProps {
  table: Table<WallpaperAndTags>
}

const { table } = defineProps<GalleryTableViewOptionsProps>()

const store = useWallpaperStore()

// const columns = computed(() => table.getAllColumns()
//   .filter(
//     column =>
//       typeof column.accessorFn !== 'undefined' && column.getCanHide()
//   ))

async function onDelete() {
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const wallpaperKeys = selectedRows.map(row => row.original.key)
  await store.deleteWallpapers(wallpaperKeys)
  table.resetRowSelection()
}
</script>

<template>
  <Button
    v-if="table.getIsSomeRowsSelected()"
    class="ml-auto mr-2 h-8 lg:flex"
    size="sm"
    variant="destructive"
    @click="onDelete"
  >
    <Icon
      class="size-4"
      name="radix-icons:trash"
    />
    Delete Selected
  </Button>
  <!-- <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        class="ml-auto hidden h-8 lg:flex"
        size="sm"
        variant="outline"
      >
        <Icon
          class="mr-2 size-4"
          name="radix-icons:mixer-horizontal"
        />
        View
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="end"
      class="w-[150px]"
    >
      <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
      <DropdownMenuSeparator />

      <DropdownMenuCheckboxItem
        v-for="column in columns"
        :key="column.id"
        :checked="column.getIsVisible()"
        class="capitalize"
        @update:checked="(value) => column.toggleVisibility(!!value)"
      >
        {{ column.id }}
      </DropdownMenuCheckboxItem>
    </DropdownMenuContent>
  </DropdownMenu> -->
</template>
