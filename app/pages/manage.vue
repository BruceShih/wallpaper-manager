<script setup lang="ts">
import type { UserToken } from '~~/server/utils/drizzle'
import { Icon } from '#components'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  useVueTable
} from '@tanstack/vue-table'
import { useToast } from '~/components/ui/toast/use-toast'

definePageMeta({
  auth: false
})

const { toast } = useToast()

const token = ref(import.meta.client ? localStorage.getItem('bearer_token') || '' : '')
const userToken = reactive<{
  tokens: UserToken[]
}>({ tokens: [] })
const columnHelper = createColumnHelper<UserToken>()

const columns = [
  columnHelper.accessor('token', {
    id: 'token',
    header: 'Token',
    cell: ({ row }) => h('div', {}, row.getValue('token'))
  }),
  columnHelper.accessor('createDate', {
    id: 'createDate',
    header: 'Create Date',
    cell: ({ row }) => h('div', {}, row.getValue('createDate'))
  }),
  columnHelper.accessor('enabled', {
    id: 'enabled',
    header: 'Enabled',
    cell: ({ row }) => {
      return h(Checkbox, {
        'checked': row.getValue<boolean>('enabled'),
        'onUpdate:checked': value => updateToken(row.getValue('id'), value)
      })
    }
  }),
  columnHelper.display({
    id: 'actions',
    cell: ({ row }) => {
      return h(Button, {
        variant: 'destructive',
        onClick: () => deleteToken(row.getValue('id'))
      }, h(Icon, {
        name: 'radix-icons:trash',
        class: 'size-4'
      }))
    }
  })
]
const table = useVueTable({
  data: userToken.tokens,
  columns,
  getCoreRowModel: getCoreRowModel()
})

async function fetchTokens() {
  const { data } = await useFetch('/api/user-token/list', {
    headers: {
      Authorization: `Bearer ${token.value}`
    }
  })

  userToken.tokens = data.value || []
}
async function createToken() {
  const { error } = await useFetch('/api/user-token', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token.value}`
    }
  })

  if (error) {
    toast({
      title: 'Create token failed',
      variant: 'destructive'
    })
  }
  else {
    fetchTokens()
    toast({
      title: 'Token created'
    })
  }
}
async function updateToken(id: number, enable: boolean) {
  const { error } = await useFetch(`/api/user-token/${id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token.value}`
    },
    body: JSON.stringify({ enable })
  })

  if (error) {
    toast({
      title: 'Update token failed',
      variant: 'destructive'
    })
  }
  else {
    toast({
      title: 'Token updated'
    })
  }
}
async function deleteToken(id: number) {
  const { error } = await useFetch(`/api/user-token/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token.value}`
    }
  })

  if (error) {
    toast({
      title: 'Delete token failed',
      variant: 'destructive'
    })
  }
  else {
    toast({
      title: 'Token deleted'
    })
  }
}

onMounted(async () => {
  fetchTokens()
})
</script>

<template>
  <div class="mx-4 mb-4 space-y-6">
    <div class="flex justify-end">
      <Button @click="createToken">
        Create new token
      </Button>
    </div>
    <Table>
      <TableHeader>
        <TableRow
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id"
        >
          <TableHead
            v-for="header in headerGroup.headers"
            :key="header.id"
            :class="cn(
              { 'w-2/3': header.id === 'token' },
            )"
          >
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="table.getRowModel().rows?.length">
          <template
            v-for="row in table.getRowModel().rows"
            :key="row.id"
          >
            <TableRow :data-state="row.getIsSelected() && 'selected'">
              <TableCell
                v-for="cell in row.getVisibleCells()"
                :key="cell.id"
              >
                <FlexRender
                  :render="cell.column.columnDef.cell"
                  :props="cell.getContext()"
                />
              </TableCell>
            </TableRow>
            <TableRow v-if="row.getIsExpanded()">
              <TableCell :colspan="row.getAllCells().length">
                {{ row.original }}
              </TableCell>
            </TableRow>
          </template>
        </template>

        <TableRow v-else>
          <TableCell
            :colspan="columns.length"
            class="h-24 text-center"
          >
            No results.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
