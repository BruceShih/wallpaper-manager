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

const token = ref(import.meta.client ? localStorage.getItem('bearer_token') || '' : '')
const userTokens = ref<UserToken[]>([])

const columns: ColumnDef<UserToken>[] = [
  {
    accessorKey: 'token',
    header: () => h('div', { class: 'text-right' }, 'Token'),
    cell: ({ row }) => {
      return h('div', {}, row.getValue('token'))
    }
  },
  {
    accessorKey: 'createDate',
    header: () => h('div', { class: 'text-right' }, 'Create Date'),
    cell: ({ row }) => {
      return h('div', {}, row.getValue('createDate'))
    }
  },
  {
    accessorKey: 'enabled',
    header: () => h('div', { class: 'text-right' }, 'Enabled'),
    cell: ({ row }) => {
      return h(Checkbox, {
        'checked': row.getValue<boolean>('enabled'),
        'onUpdate:checked': value => updateToken(row.getValue('id'), value)
      })
    }
  },
  {
    id: 'actions',
    header: () => h('div', { class: 'text-right' }, ''),
    cell: ({ row }) => {
      return h(Button, {
        variant: 'destructive',
        onClick: () => deleteToken(row.getValue('id'))
      }, h(Icon, {
        name: 'radix-icons:trash',
        class: 'size-4'
      }))
    }
  }
]

async function fetchTokens() {
  const { data } = await useFetch('/api/token/list', {
    headers: {
      Authorization: `Bearer ${token.value}`
    }
  })

  console.info('token list', data)
  userTokens.value = data.value || []
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

onMounted(async () => {
  await fetchTokens()
})
</script>

<template>
  <div class="mx-4 mb-4 space-y-6">
    <div class="flex justify-end">
      <Button @click="createToken">
        Create new token
      </Button>
    </div>
    <DataTable
      :columns="columns"
      :data="userTokens"
    />
  </div>
</template>
