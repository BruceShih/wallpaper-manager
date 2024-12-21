<script setup lang="ts">
import type { UserToken } from '~~/server/types/drizzle'
import {
  CustomTableColumnHeader,
  CustomTableRowBoolean,
  TokenTableRowActions,
  TokenTableRowCopyable
} from '#build/components'
import { createColumnHelper } from '@tanstack/vue-table'
import { Checkbox } from '~/components/ui/checkbox'

if (import.meta.dev) {
  definePageMeta({
    auth: false
  })
}

useHead({
  title: 'Token - Wallpaper Manager'
})

const columnHelper = createColumnHelper<UserToken>()
const columns = [
  columnHelper.display({
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
  }),
  columnHelper.accessor('token', {
    header: ({ column }) => h(CustomTableColumnHeader<UserToken>, { column, title: 'Token' }),
    cell: ({ row }) => h(TokenTableRowCopyable, { row }),
    enableSorting: true,
    enableHiding: false
  }),
  columnHelper.accessor('createDate', {
    header: ({ column }) => h(CustomTableColumnHeader<UserToken>, { column, title: 'Create Date' }),
    cell: ({ row }) => h('div', { class: 'w-[250px] flex items-center' }, row.original.createDate),
    enableSorting: true,
    enableHiding: false
  }),
  columnHelper.accessor('enabled', {
    header: ({ column }) => h(CustomTableColumnHeader<UserToken>, { column, title: 'Enabled' }),
    cell: ({ row }) => h(CustomTableRowBoolean, { isTrue: row.original.enabled, class: 'w-[50px]' }),
    enableSorting: true,
    enableHiding: false
  }),
  columnHelper.display({
    id: 'actions',
    cell: ({ row }) => h(TokenTableRowActions, { row, onUpdate }),
    size: 50,
    enableSorting: false,
    enableHiding: false
  })
]

const store = useTokenStore()

async function onUpdate(data: { id: number, enable: boolean }) {
  await store.updateToken(data.id, data.enable)
}

onMounted(async () => {
  await store.fetchTokens()
})
</script>

<template>
  <div class="space-y-4">
    <CustomTable
      :columns="columns"
      :data="store.tokens"
    >
      <template #toolbar="{ table }">
        <TokenTableToolbar :table="table" />
      </template>
    </CustomTable>
  </div>
</template>
