<script setup lang="ts">
import type { Tag } from '~~/server/utils/drizzle'
import { ListItems, ListToolbar, type UploadListItem } from '.'

interface UploadListProps {
  tags: Tag[]
}

const { tags } = defineProps<UploadListProps>()

const api = useWallpaperAPIs()

const images = reactive<UploadListItem[]>([])

const totalImageSelected = computed(() => images.filter(image => image.selected).length)

function onFileSelected(files: File[]) {
  const newFiles = files.filter(file => !images.some(image => image.image?.name === file.name))
  images.push(...newFiles.map(
    file => ({ image: file, tags: [], selected: false, stats: 'not-started' } satisfies UploadListItem)
  ))
}
function onUpload() {
  const promises = images.map(image => (
    api.uploadWallpaper(image.image.name, image.tags, image.image)
      .then((response) => {
        if (response.status.value === 'success')
          image.stats = 'uploaded'
        else
          image.stats = 'failed'
      })
      .catch(() => {
        image.stats = 'failed'
      })
  ))
  Promise.allSettled(promises)
}
function onTagsApply(tags: string[]) {
  images.forEach((image) => {
    if (image.selected) {
      // this is to prevent image.tags from being reactive
      image.tags = [...tags]
    }
  })
}
</script>

<template>
  <ListToolbar
    :all-tags="tags"
    :image-selected="totalImageSelected"
    @change="onFileSelected"
    @tags-apply="onTagsApply"
    @upload="onUpload"
  />
  <div class="flex gap-4 rounded-md border p-4">
    <Label
      v-if="images.length === 0"
      class="flex h-32 w-full items-center justify-center"
    >
      No image selected
    </Label>
    <ListItems
      v-model="images"
      :all-tags="tags"
      @remove="item => images.splice(images.indexOf(item), 1)"
    />
  </div>
</template>
