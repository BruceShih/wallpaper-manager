<script setup lang="ts">
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState
} from '@tanstack/vue-table'
import type { UserToken } from '~~/server/utils/drizzle'
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
} from '../ui/table'
import { useToast } from '../ui/toast/use-toast'

interface GalleryTableProps {
  columns: ColumnDef<UserToken, unknown>[]
  data: UserToken[]
}
const props = defineProps<GalleryTableProps>()

const api = useWallpaperService()
const store = useWallpaperStore()
const { toast } = useToast()

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
  meta: {
    removeRows: async (ids: number[]) => {
      const { error } = await api.token.delete(ids)

      if (error.value) {
        toast({
          title: 'Failed to delete token',
          variant: 'destructive'
        })
      }
      else {
        store.tokens = store.tokens.filter(token => !ids.includes(token.id))

        toast({
          title: 'Token deleted'
        })
      }
    }
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
    <TokenTableToolbar :table="table" />
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

    <TablePagination :table="table" />
  </div>
</template>
