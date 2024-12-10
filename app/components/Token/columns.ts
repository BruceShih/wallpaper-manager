import type { ColumnDef } from '@tanstack/vue-table'
import type { UserToken } from '~~/server/utils/drizzle'
import {
  CustomTableColumnHeader,
  CustomTableRowBoolean,
  TokenTableRowActions,
  TokenTableRowCopyable
} from '#components'
import { h } from 'vue'
import { Checkbox } from '../ui/checkbox'

export const columns: ColumnDef<UserToken>[] = [
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
    accessorKey: 'token',
    header: ({ column }) => h(CustomTableColumnHeader<UserToken>, { column, title: 'Token' }),
    cell: ({ row }) => h(TokenTableRowCopyable, { row }),
    enableSorting: true,
    enableHiding: false
  },
  {
    accessorKey: 'createDate',
    header: ({ column }) => h(CustomTableColumnHeader<UserToken>, { column, title: 'Create Date' }),
    cell: ({ row }) => h('div', { class: 'w-[250px] flex items-center' }, row.original.createDate),
    enableSorting: true,
    enableHiding: false
  },
  {
    accessorKey: 'enabled',
    header: ({ column }) => h(CustomTableColumnHeader<UserToken>, { column, title: 'Enabled' }),
    cell: ({ row }) => h(CustomTableRowBoolean, { isTrue: row.original.enabled, class: 'w-[50px]' }),
    enableSorting: true,
    enableHiding: false
  },
  {
    id: 'actions',
    cell: ({ row }) => h(TokenTableRowActions, { row }),
    size: 50,
    enableSorting: false,
    enableHiding: false
  }
]
