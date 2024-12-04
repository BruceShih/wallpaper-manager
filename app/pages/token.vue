<script setup lang="ts">
import { columns } from '~/components/Token/columns'

if (import.meta.dev) {
  definePageMeta({
    auth: false
  })
}

const store = useWallpaperStore()

onMounted(async () => {
  await store.fetchTokens()
})
</script>

<template>
  <div class="space-y-4">
    <TokenTable
      :columns="columns"
      :data="store.tokens"
    />
  </div>
</template>
