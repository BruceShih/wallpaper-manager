<script setup lang="ts">
import { columns } from '~/components/Token/columns'

if (import.meta.dev) {
  definePageMeta({
    auth: false
  })
}

const store = useTokenStore()

onMounted(async () => {
  await store.fetchTokens()
})
</script>

<template>
  <div class="space-y-4">
    <CustomTable
      :columns="columns"
      :data="store.tokens"
    >
      <template #toolbar="{ table }">
        <TokenTableToolbar :table="table" />
      </template>
    </CustomTable>
  </div>
</template>
