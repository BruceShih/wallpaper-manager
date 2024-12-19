<script setup lang="ts">
import type { Tag } from '~~/server/types/drizzle'
import type { UploadListItem } from './types'

interface UploadListProps {
  tags: Tag[]
}

const { tags } = defineProps<UploadListProps>()
const modelValue = defineModel<UploadListItem[]>('images', { required: true })
</script>

<template>
  <slot name="toolbar" />
  <div
    v-if="images.length === 0"
    class="flex items-center justify-center rounded-md border"
  >
    <Label class="flex h-32 w-full items-center justify-center">
      No image selected
    </Label>
  </div>
  <div
    v-else
    class="grid grid-cols-2 gap-4 rounded-md border p-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6
      2xl:grid-cols-8"
  >
    <UploadListItems
      v-model="modelValue"
      :all-tags="tags"
      @remove="item => modelValue.splice(modelValue.indexOf(item), 1)"
    />
  </div>
</template>
