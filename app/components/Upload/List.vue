<script setup lang="ts">
import type { Tag } from '~~/server/utils/drizzle'
import { ListItems, ListToolbar, type UploadListItem } from '.'

interface UploadListProps {
  tags: Tag[]
}

const { tags } = defineProps<UploadListProps>()

const api = useWallpaperAPIs()

const selectedImages = reactive<UploadListItem[]>([])

function onFileSelected(files: File[]) {
  const newFiles = files.filter(file => !selectedImages.some(image => image.image?.name === file.name))
  selectedImages.push(...newFiles.map(
    file => ({ image: file, tags: [], stats: 'not-started' } satisfies UploadListItem)
  ))
}
function onUpload() {
  const promises = selectedImages.map(image => (
    api.uploadWallpaper(image.image.name, image.tags, image.image)
      .then((response) => {
        if (response.error) {
          image.stats = 'failed'
        }
        else {
          image.stats = 'uploaded'
        }
      })
      .catch(() => {
        image.stats = 'failed'
      })
  ))
  Promise.allSettled(promises)
  // .then(() => {
  //   selectedImages.splice(0, selectedImages.length)
  // })
}
</script>

<template>
  <ListToolbar
    @change="onFileSelected"
    @upload="onUpload"
  />
  <div class="flex gap-4 rounded-md border p-4">
    <Label
      v-if="selectedImages.length === 0"
      class="flex h-32 w-full items-center justify-center"
    >
      No image selected
    </Label>
    <ListItems
      v-model="selectedImages"
      :all-tags="tags"
      @remove="item => selectedImages.splice(selectedImages.indexOf(item), 1)"
    />
  </div>
</template>
