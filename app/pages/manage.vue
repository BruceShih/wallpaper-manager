<script setup lang="ts">
import type { UserToken } from '~~/server/utils/drizzle'
import { Icon } from '#components'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '~/components/ui/toast/use-toast'

const { toast } = useToast()

const loading = ref(false)
const sessionToken = ref(import.meta.client ? localStorage.getItem('bearer_token') || '' : '')
const userTokens = ref<UserToken[]>([])

async function fetchTokens() {
  loading.value = true
  userTokens.value = []

  const { data } = await useFetch('/api/token/list', {
    headers: {
      Authorization: `Bearer ${sessionToken.value}`
    }
  })

  userTokens.value = data.value || []
  loading.value = false
}
async function createToken() {
  const { error } = await useFetch('/api/token', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${sessionToken.value}`
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
      Authorization: `Bearer ${sessionToken.value}`
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
      Authorization: `Bearer ${sessionToken.value}`
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="w-1/2">
            Token
          </TableHead>
          <TableHead class="w-1/6">
            Create Date
          </TableHead>
          <TableHead class="w-1/6">
            Enabled
          </TableHead>
          <TableHead class="w-1/6" />
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="(token, index) in userTokens"
          :key="index"
        >
          <TableCell>
            <pre>{{ token.token }}</pre>
          </TableCell>
          <TableCell>{{ token.createDate }}</TableCell>
          <TableCell>
            <Checkbox
              :checked="token.enabled"
              @update:checked="updateToken(token.id, $event)"
            />
          </TableCell>
          <TableCell>
            <Button
              variant="destructive"
              @click="deleteToken(token.id)"
            >
              <Icon
                name="radix-icons:trash"
                class="size-4"
              />
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
