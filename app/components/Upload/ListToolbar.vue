<script setup lang="ts">
const emits = defineEmits<{
  change: [files: File[]]
  upload: [void]
}>()

const fileInput = ref<HTMLInputElement>()
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="grid w-[300px] max-w-sm items-center gap-1.5">
      <input
        id="file"
        ref="fileInput"
        accept="image/*"
        class="hidden"
        multiple
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
    <Button
      class="ml-auto mr-2 h-8 lg:flex"
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
</template>
