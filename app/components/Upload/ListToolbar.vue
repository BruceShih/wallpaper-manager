<script setup lang="ts">
import { ListItemTagSelect } from '.'

interface UploadListToolbarProps {
  imageSelected: number
  allTags: Tag[]
}

const { imageSelected, allTags } = defineProps<UploadListToolbarProps>()
const emits = defineEmits<{
  change: [files: File[]]
  upload: [void]
  tagsApply: [tags: string[]]
}>()

const fileInput = ref<HTMLInputElement>()
const tags = ref<string[]>([])
</script>

<template>
  <div class="flex items-center justify-between space-x-4">
    <div class="grid w-[300px] max-w-sm items-center gap-1.5">
      <input
        id="file"
        ref="fileInput"
        accept="jpeg, jpg"
        class="hidden"
        multiple
        name="file"
        placeholder="files"
        type="file"
        @input="emits('change', Array.from(fileInput?.files || []))"
      >
      <label
        class="flex h-8 w-full items-center rounded-md border border-input bg-transparent px-3 py-1 text-sm
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
    </div>
    <div class="ml-auto flex w-[600px] items-center justify-end space-x-2">
      <span class="w-[150px] text-sm">
        {{ imageSelected }} selected
      </span>
      <ListItemTagSelect
        v-model="tags"
        :tags="allTags"
      />
      <Button
        class="h-8 lg:flex"
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
        class="h-8 lg:flex"
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
