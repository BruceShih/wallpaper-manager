<script setup lang="ts">
if (import.meta.dev) {
  definePageMeta({
    auth: false
  })
}

const store = useWallpaperStore()

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
