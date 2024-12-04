import type { ColumnDef } from '@tanstack/vue-table'
import type { WallpaperAndTags } from './types'
import { GalleryTableRowActions, GalleryTableRowLink, Icon, TableColumnHeader } from '#components'
import { h } from 'vue'
import { Badge } from '../ui/badge'
import { Checkbox } from '../ui/checkbox'

export const columns: ColumnDef<WallpaperAndTags>[] = [
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
    header: ({ column }) => h(TableColumnHeader<WallpaperAndTags>, { column, title: 'Key' }),
    cell: ({ row }) => h(GalleryTableRowLink, { row, class: 'w-[400px]' }),
    enableSorting: true,
    enableHiding: false
  },
  {
    accessorKey: 'tags',
    header: ({ column }) => h(TableColumnHeader<WallpaperAndTags>, { column, title: 'Tags' }),
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
    header: ({ column }) => h(TableColumnHeader<WallpaperAndTags>, { column, title: 'Favorite' }),
    cell: ({ row }) => h('div', { class: 'w-[100px] flex items-center' }, row.original.favorite
      ? h(Icon, { name: 'radix-icons:heart-filled', class: 'text-destructive size-4' })
      : h(Icon, { name: 'radix-icons:heart', class: 'text-destructive size-4' })),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: true,
    enableHiding: false
  },
  {
    accessorKey: 'alive',
    header: ({ column }) => h(TableColumnHeader<WallpaperAndTags>, { column, title: 'Alive' }),
    cell: ({ row }) => h('div', { class: 'w-[100px] flex items-center' }, row.original.alive
      ? 'True'
      : 'False'),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: true,
    enableHiding: false
  },
  {
    id: 'actions',
    cell: ({ row }) => h(GalleryTableRowActions, { row }),
    enableSorting: false,
    enableHiding: false
  }
]
