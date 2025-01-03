<script setup lang="ts" generic="T">
import type { Table } from '@tanstack/vue-table'

interface DataTablePaginationProps {
  table: Table<T>
}

const props = defineProps<DataTablePaginationProps>()

function onSelectUpdate(val: string) {
  const pageSize = Number(val)
  if (Number.isNaN(pageSize))
    return

  props.table.setPageSize(Number(val))
}
</script>

<template>
  <div class="flex items-center justify-between px-2">
    <div class="flex-1 text-sm text-muted-foreground">
      {{ table.getFilteredSelectedRowModel().rows.length }} of
      {{ table.getFilteredRowModel().rows.length }} row(s) selected.
    </div>
    <div class="flex items-center space-x-6 lg:space-x-8">
      <div class="flex items-center space-x-2">
        <p class="text-sm font-medium">
          Rows per page
        </p>
        <Select
          :model-value="`${table.getState().pagination.pageSize}`"
          @update:model-value="onSelectUpdate"
        >
          <SelectTrigger class="h-8 w-[70px]">
            <SelectValue :placeholder="`${table.getState().pagination.pageSize}`" />
          </SelectTrigger>
          <SelectContent side="top">
            <SelectItem
              v-for="pageSize in [10, 20, 30, 40, 50]"
              :key="pageSize"
              :value="`${pageSize}`"
            >
              {{ pageSize }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="flex w-[100px] items-center justify-center text-sm font-medium">
        Page {{ table.getState().pagination.pageIndex + 1 }} of
        {{ table.getPageCount() }}
      </div>
      <div class="flex items-center space-x-2">
        <Button
          class="hidden size-8 p-0 lg:flex"
          :disabled="!table.getCanPreviousPage()"
          variant="outline"
          @click="table.setPageIndex(0)"
        >
          <span class="sr-only">Go to first page</span>
          <Icon
            class="size-4"
            name="lucide:chevrons-left"
          />
        </Button>
        <Button
          class="size-8 p-0"
          :disabled="!table.getCanPreviousPage()"
          variant="outline"
          @click="table.previousPage()"
        >
          <span class="sr-only">Go to previous page</span>
          <Icon
            class="size-4"
            name="lucide:chevron-left"
          />
        </Button>
        <Button
          class="size-8 p-0"
          :disabled="!table.getCanNextPage()"
          variant="outline"
          @click="table.nextPage()"
        >
          <span class="sr-only">Go to next page</span>
          <Icon
            class="size-4"
            name="lucide:chevron-right"
          />
        </Button>
        <Button
          class="hidden size-8 p-0 lg:flex"
          :disabled="!table.getCanNextPage()"
          variant="outline"
          @click="table.setPageIndex(table.getPageCount() - 1)"
        >
          <span class="sr-only">Go to last page</span>
          <Icon
            class="size-4"
            name="lucide:chevrons-right"
          />
        </Button>
      </div>
    </div>
  </div>
</template>
