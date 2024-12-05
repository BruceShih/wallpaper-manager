<script setup lang="ts" generic="T">
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  Table as TanstackTable,
  VisibilityState
} from '@tanstack/vue-table'
import {
  FlexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable
} from '@tanstack/vue-table'
import { ref } from 'vue'
import { valueUpdater } from '~/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from './ui/table'

interface GalleryTableProps {
  columns: ColumnDef<T, unknown>[]
  data: T[]
}
const props = defineProps<GalleryTableProps>()
defineSlots<{
  toolbar: (props: { table: TanstackTable<T> }) => unknown
}>()

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})

const table = useVueTable({
  get data() { return props.data },
  get columns() { return props.columns },
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get columnVisibility() { return columnVisibility.value },
    get rowSelection() { return rowSelection.value }
  },
  onSortingChange: val => valueUpdater(val, sorting),
  onColumnFiltersChange: val => valueUpdater(val, columnFilters),
  onColumnVisibilityChange: val => valueUpdater(val, columnVisibility),
  onRowSelectionChange: val => valueUpdater(val, rowSelection),
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFacetedRowModel: getFacetedRowModel(),
  getFacetedUniqueValues: getFacetedUniqueValues()
})
</script>

<template>
  <div class="space-y-4">
    <slot
      name="toolbar"
      :table="table"
    />
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
          >
            <TableHead
              v-for="header in headerGroup.headers"
              :key="header.id"
            >
              <FlexRender
                v-if="!header.isPlaceholder"
                :props="header.getContext()"
                :render="header.column.columnDef.header"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <TableRow
              v-for="row in table.getRowModel().rows"
              :key="row.id"
              :data-state="row.getIsSelected() && 'selected'"
            >
              <TableCell
                v-for="cell in row.getVisibleCells()"
                :key="cell.id"
              >
                <FlexRender
                  :props="cell.getContext()"
                  :render="cell.column.columnDef.cell"
                />
              </TableCell>
            </TableRow>
          </template>

          <TableRow v-else>
            <TableCell
              class="h-24 text-center"
              :colspan="columns.length"
            >
              No results.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <CustomTablePagination :table="table" />
  </div>
</template>
