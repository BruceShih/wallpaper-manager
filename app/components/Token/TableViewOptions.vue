<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import type { UserToken } from '~~/server/types/drizzle'

interface TokenTableViewOptionsProps {
  table: Table<UserToken>
}

const { table } = defineProps<TokenTableViewOptionsProps>()

const store = useTokenStore()

// const columns = computed(() => table.getAllColumns()
//   .filter(
//     column =>
//       typeof column.accessorFn !== 'undefined' && column.getCanHide()
//   ))

async function onCreate() {
  await store.createToken()
}
async function onDelete() {
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const tokenIds = selectedRows.map(row => row.original.id)
  await store.deleteTokens(tokenIds)
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
      name="lucide:trash"
    />
    Delete Selected
  </Button>
  <Button
    class="ml-auto mr-2 h-8 lg:flex"
    size="sm"
    variant="default"
    @click="onCreate"
  >
    <Icon
      class="size-4"
      name="lucide:plus"
    />
    Create Token
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
          name="lucide:sliders-horizontal"
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
