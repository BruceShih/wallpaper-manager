<script setup lang="ts">
import type { ColumnDef, Table } from '@tanstack/vue-table'
import type { WallpaperAndTags } from '~/components/Gallery/types'
import {
  DataTableColumnHeader,
  DataTableRowBoolean,
  GalleryTableRowActions,
  GalleryTableRowLink,
  Icon
} from '#components'
import { Badge } from '~/components/ui/badge'
import { Checkbox } from '~/components/ui/checkbox'

if (import.meta.dev) {
  definePageMeta({
    auth: false
  })
}

useHead({
  title: 'Gallery - Wallpaper Manager'
})

const columns = [
  {
    id: 'select',
    header: ({ table }) => h(Checkbox, {
      'checked': table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
      'onUpdate:checked': value => table.toggleAllPageRowsSelected(!!value),
      'ariaLabel': 'Select all',
      'class': 'translate-y-0.5'
    }),
    cell: ({ row }) => h(Checkbox, {
      'checked': row.getIsSelected(),
      'onUpdate:checked': value => row.toggleSelected(!!value),
      'ariaLabel': 'Select row',
      'class': 'translate-y-0.5'
    }),
    enableSorting: true,
    enableHiding: false
  },
  {
    accessorKey: 'key',
    header: ({ column }) => h(DataTableColumnHeader<WallpaperAndTags>, { column, title: 'Key' }),
    cell: ({ row }) => h(GalleryTableRowLink, { row, class: 'w-[400px]' }),
    enableSorting: true,
    enableHiding: false
  },
  {
    accessorKey: 'tags',
    header: ({ column }) => h(DataTableColumnHeader<WallpaperAndTags>, { column, title: 'Tags' }),
    cell: ({ row }) => {
      return h('div', { class: 'w-[250px] flex space-x-2' }, [
        row.original.tags.map(tag => h(Badge, { variant: tag.sensitive
          ? 'destructive'
          : 'outline'
        }, () => tag.tag))
      ])
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'favorite',
    header: ({ column }) => h(DataTableColumnHeader<WallpaperAndTags>, { column, title: 'Favorite' }),
    cell: ({ row }) => h('div', { class: 'w-[100px] flex items-center' }, row.original.favorite
      ? h(Icon, { name: 'lucide:heart', class: 'text-destructive size-4' })
      : ''),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: true,
    enableHiding: false
  },
  {
    accessorKey: 'alive',
    header: ({ column }) => h(DataTableColumnHeader<WallpaperAndTags>, { column, title: 'Alive' }),
    cell: ({ row }) => h(DataTableRowBoolean, { isTrue: row.original.alive, class: 'w-[100px]' }),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: true,
    enableHiding: false
  },
  {
    id: 'actions',
    cell: ({ row }) => h(GalleryTableRowActions, { row, onEdit }),
    enableSorting: false,
    enableHiding: false
  }
] satisfies ColumnDef<WallpaperAndTags>[]

const wallpaperStore = useWallpaperStore()
const tagStore = useTagStore()

async function onEdit(data: { key: string, favorite: boolean, tags: number[] }) {
  await wallpaperStore.updateWallpaper({
    id: data.key,
    body: {
      favorite: data.favorite,
      tags: data.tags
    }
  })
}
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
    <DataTable
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
    </DataTable>
  </div>
</template>
