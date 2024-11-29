<script setup lang="ts">
import type { UserToken } from '~~/server/utils/drizzle'
import { useToast } from '~/components/ui/toast/use-toast'

const { toast } = useToast()

const loading = ref(false)
const sessionToken = useBearerToken()
const userTokens = ref<UserToken[]>([])

async function fetchTokens() {
  loading.value = true
  userTokens.value = []

  const { data } = await useFetch('/api/token/list', {
    headers: {
      Authorization: `Bearer ${sessionToken}`
    }
  })

  userTokens.value = data.value || []
  loading.value = false
}
async function createToken() {
  const { data, error } = await useFetch<UserToken[]>('/api/token', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${sessionToken}`
    }
  })

  if (error.value) {
    toast({
      title: 'Failed to create token',
      variant: 'destructive'
    })
  }
  else {
    if (data.value) {
      for (const token of data.value)
        userTokens.value.push(token)
    }

    toast({
      title: 'Token created'
    })
  }
}
async function updateToken(id: number, enable: boolean) {
  const { error } = await useFetch(`/api/token/${id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${sessionToken}`
    },
    body: JSON.stringify({ enable })
  })

  if (error.value) {
    toast({
      title: 'Failed to update token',
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
      Authorization: `Bearer ${sessionToken}`
    }
  })

  if (error.value) {
    toast({
      title: 'Failed to delete token',
      variant: 'destructive'
    })
  }
  else {
    userTokens.value = userTokens.value.filter(token => token.id !== id)

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
        class="mr-4"
        variant="secondary"
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
          class="animate-spin"
          name="radix-icons:reload"
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
          <TableHead class="w-7/12">
            Token
          </TableHead>
          <TableHead class="w-3/12">
            Create Date
          </TableHead>
          <TableHead class="w-1/12">
            Enabled
          </TableHead>
          <TableHead class="w-1/12" />
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
                class="size-4"
                name="radix-icons:trash"
              />
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
