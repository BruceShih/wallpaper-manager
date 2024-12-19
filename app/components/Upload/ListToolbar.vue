<script setup lang="ts">
import type { Tag } from '~~/server/types/drizzle'

interface UploadListToolbarProps {
  numberOfImagesToUpload: number
  imageSelected: number
  uploading: boolean
  allTags: Tag[]
}

const {
  numberOfImagesToUpload,
  imageSelected,
  uploading,
  allTags
} = defineProps<UploadListToolbarProps>()
const emits = defineEmits<{
  change: [files: File[]]
  upload: [void]
  tagsApply: [tags: string[]]
}>()
const selectAll = defineModel<boolean>('selectAll', { required: true })
const tags = ref<string[]>([])

function onChange(files: File[]) {
  emits('change', files)
}
function onUpload() {
  emits('upload')
  tags.value = []
}
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex w-1/2 items-center justify-start gap-x-2">
      <UploadListImageInput
        @change="onChange($event)"
      />
    </div>
    <div class="flex w-1/2 items-center justify-end space-x-4">
      <div class="flex items-center space-x-2">
        <Toggle
          v-model:pressed="selectAll"
          aria-label="Select all"
          class="space-x-2"
          :disabled="numberOfImagesToUpload === 0"
        >
          <template v-if="selectAll">
            <label class="text-sm">Unselect all</label>
            <Icon
              class="size-4"
              name="radix-icons:checkbox"
            />
          </template>
          <template v-else>
            <label class="text-sm">Select all</label>
            <Icon
              class="size-4"
              name="radix-icons:stop"
            />
          </template>
        </Toggle>
        <span
          v-if="imageSelected > 0"
          class="text-sm text-secondary"
        >
          ({{ imageSelected }} selected)
        </span>
        <UploadListItemTagSelect
          v-model="tags"
          :tags="allTags"
        />
        <Button
          class="flex h-8 items-center"
          size="sm"
          variant="secondary"
          @click="emits('tagsApply', tags)"
        >
          <Icon
            class="size-4"
            name="radix-icons:bookmark"
          />
          Apply tags
        </Button>
      </div>
      <Separator
        class="h-8"
        orientation="vertical"
      />
      <Button
        class="flex h-8 items-center"
        :disabled="numberOfImagesToUpload === 0 || uploading"
        size="sm"
        variant="default"
        @click="onUpload"
      >
        <Icon
          v-if="uploading"
          class="size-4 animate-spin"
          name="radix-icons:reload"
        />
        <Icon
          v-else
          class="size-4"
          name="radix-icons:upload"
        />
        Upload
      </Button>
    </div>
  </div>
</template>
