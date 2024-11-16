<script setup lang="ts">
// TODO: WIP component
import type { Table } from '@tanstack/vue-table'
import type { Image } from '~~/server/utils/drizzle'

interface DataTableViewOptionsProps {
  table: Table<Image>
}

const props = defineProps<DataTableViewOptionsProps>()

const columns = computed(() => props.table.getAllColumns()
  .filter(
    column =>
      typeof column.accessorFn !== 'undefined' && column.getCanHide()
  ))
</script>

<template>
  <DropdownMenu>
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
  </DropdownMenu>
</template>
