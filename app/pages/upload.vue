<script setup lang="ts">
if (import.meta.dev) {
  definePageMeta({
    auth: false
  })
}

useHead({
  title: 'Token - Wallpaper Manager'
})

const store = useTagStore()

onMounted(async () => {
  if (store.tags.length === 0)
    await store.fetchTags()
})
</script>

<template>
  <div class="space-y-4">
    <UploadList :tags="store.tags" />
  </div>
</template>
