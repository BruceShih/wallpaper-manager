<script setup lang="ts">
import type {
  ColumnDef
} from '@tanstack/vue-table'
import type { UserToken } from '~~/server/utils/drizzle'
import { Icon } from '#components'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '~/components/ui/toast/use-toast'

const { toast } = useToast()

const loading = ref(false)
const token = ref(import.meta.client ? localStorage.getItem('bearer_token') || '' : '')
const userTokens = ref<UserToken[]>([])

const columns: ColumnDef<UserToken>[] = [
  {
    accessorKey: 'token',
    header: () => 'Token',
    cell: ({ row }) => {
      return h('pre', {}, row.getValue('token'))
    },
    minSize: 286
  },
  {
    accessorKey: 'createDate',
    header: () => 'Create Date',
    cell: ({ row }) => {
      return row.getValue('createDate')
    },
    size: 180
  },
  {
    accessorKey: 'enabled',
    header: () => 'Enabled',
    cell: ({ row }) => {
      return h(Checkbox, {
        'checked': row.getValue<boolean>('enabled'),
        'onUpdate:checked': value => updateToken(row.getValue('id'), value)
      })
    },
    size: 60
  },
  {
    id: 'actions',
    header: () => '',
    cell: ({ row }) => {
      return h(Button, {
        variant: 'destructive',
        onClick: () => deleteToken(row.getValue('id'))
      }, h(Icon, {
        name: 'radix-icons:trash',
        class: 'size-4'
      }))
    },
    size: 60
  }
]

async function fetchTokens() {
  loading.value = true
  userTokens.value = []

  const { data } = await useFetch('/api/token/list', {
    headers: {
      Authorization: `Bearer ${token.value}`
    }
  })

  userTokens.value = data.value || []
  loading.value = false
}
async function createToken() {
  const { error } = await useFetch('/api/token', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token.value}`
    }
  })

  if (error.value) {
    toast({
      title: 'Create token failed',
      variant: 'destructive'
    })
  }
  else {
    await fetchTokens()
    toast({
      title: 'Token created'
    })
  }
}
async function updateToken(id: number, enable: boolean) {
  const { error } = await useFetch(`/api/token/${id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token.value}`
    },
    body: JSON.stringify({ enable })
  })

  if (error.value) {
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
  const { error } = await useFetch(`/api/token/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token.value}`
    }
  })

  if (error.value) {
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
async function onSearch() {
  await fetchTokens()
}
</script>

<template>
  <div class="mx-4 mb-4 space-y-6">
    <div class="flex justify-end">
      <Button
        variant="secondary"
        class="mr-4"
        @click="createToken"
      >
        Create new token
      </Button>
      <Button
        :disabled="loading"
        @click="onSearch"
      >
        <Icon
          v-if="loading"
          name="radix-icons:reload"
          class="animate-spin"
        />
        <template v-if="loading">
          Searching...
        </template>
        <template v-else>
          Search
        </template>
      </Button>
    </div>
    <DataTable
      :columns="columns"
      :data="userTokens"
    />
  </div>
</template>
