<script setup lang="ts">
import type { Tag } from '~~/server/types/drizzle'

interface UploadListToolbarProps {
  imageSelected: number
  allTags: Tag[]
}

const { imageSelected, allTags } = defineProps<UploadListToolbarProps>()
const emits = defineEmits<{
  change: [files: File[]]
  upload: [void]
  selectAll: [boolean]
  tagsApply: [tags: string[]]
}>()

const fileInput = ref<HTMLInputElement>()
const tags = ref<string[]>([])
const selectedAll = ref(false)
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex w-1/2 items-center justify-start gap-x-2">
      <input
        id="file"
        ref="fileInput"
        accept="image/*"
        class="hidden"
        multiple
        name="file"
        placeholder="files"
        type="file"
        @input="emits('change', Array.from(fileInput?.files || []))"
      >
      <label
        class="flex h-8 w-2/3 items-center rounded-md border border-input bg-transparent px-3 py-1 text-sm
          shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium
          placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1
          focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        for="file"
      >
        <Icon
          class="mr-2 size-4"
          name="radix-icons:magnifying-glass"
        />
        Select images...
      </label>
      <div class="flex w-1/3 items-center space-x-2">
        <Checkbox
          id="select-all"
          v-model:checked="selectedAll"
          @update:checked="emits('selectAll', selectedAll)"
        />
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          for="select-all"
        >
          <template v-if="selectedAll">
            Unselect all
          </template>
          <template v-else>
            Select all
          </template>
        </label>
        <span
          v-if="imageSelected > 0"
          class="text-sm"
        >
          ({{ imageSelected }} selected)
        </span>
      </div>
    </div>
    <div class="flex w-1/2 items-center justify-end space-x-2">
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
      <Button
        class="flex h-8 items-center"
        size="sm"
        variant="default"
        @click="emits('upload')"
      >
        <Icon
          class="size-4"
          name="radix-icons:upload"
        />
        Upload
      </Button>
    </div>
  </div>
</template>
