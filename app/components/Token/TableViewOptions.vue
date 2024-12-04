<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import type { UserToken } from '~~/server/utils/drizzle'
import { useToast } from '~/components/ui/toast/use-toast'

const { table } = defineProps<TokenTableViewOptionsProps>()

const store = useWallpaperStore()

interface TokenTableViewOptionsProps {
  table: Table<UserToken>
}

const { toast } = useToast()
const api = useWallpaperService()

// const columns = computed(() => table.getAllColumns()
//   .filter(
//     column =>
//       typeof column.accessorFn !== 'undefined' && column.getCanHide()
//   ))

async function onCreate() {
  const { data, error } = await api.token.create()

  if (error.value) {
    toast({
      title: 'Failed to create token',
      variant: 'destructive'
    })
  }
  else {
    if (data.value) {
      for (const token of data.value)
        store.tokens.push(token)
    }

    toast({
      title: 'Token created'
    })
  }
}
async function onDelete() {
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const tokenIds = selectedRows.map(row => row.original.id)
  await table.options.meta?.removeRows(tokenIds)
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
  <Button
    class="ml-auto mr-2 h-8 lg:flex"
    size="sm"
    variant="default"
    @click="onCreate"
  >
    <Icon
      class="size-4"
      name="radix-icons:plus"
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
