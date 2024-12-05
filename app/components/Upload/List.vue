<script setup lang="ts">
import type { Tag } from '~~/server/utils/drizzle'
import type { UploadListItem } from './types'

interface UploadListProps {
  tags: Tag[]
}

const { tags } = defineProps<UploadListProps>()

const store = useWallpaperStore()

const images = reactive<UploadListItem[]>([])

const totalImageSelected = computed(() => images.filter(image => image.selected).length)

function onFileSelected(files: File[]) {
  const newFiles = files.filter(file => !images.some(image => image.image?.name === file.name))
  images.push(...newFiles.map(
    file => ({ image: file, tags: [], selected: false, status: 'not-started' } satisfies UploadListItem)
  ))
}
function onUpload() {
  const promises: Promise<unknown>[] = []

  const isSomeSelected = images.some(image => image.selected)
  if (isSomeSelected) {
    images.forEach((image) => {
      if (image.selected) {
        image.status = 'uploading'
        promises.push(
          store.uploadWallpaper(
            { id: image.image.name, tags: image.tags, body: image.image },
            () => {
              image.status = 'uploaded'
            },
            () => {
              image.status = 'failed'
            }
          )
        )
      }
    })
  }
  else {
    images.forEach((image) => {
      image.status = 'uploading'
      promises.push(
        store.uploadWallpaper(
          { id: image.image.name, tags: image.tags, body: image.image },
          () => {
            image.status = 'uploaded'
          },
          () => {
            image.status = 'failed'
          }
        )
      )
    })
  }

  Promise.allSettled(promises).catch((error) => {
    console.error(error)
  })
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
  <UploadListToolbar
    :all-tags="tags"
    :image-selected="totalImageSelected"
    @change="onFileSelected"
    @tags-apply="onTagsApply"
    @upload="onUpload"
  />
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
    class="grid grid-cols-5 gap-4 rounded-md border p-4"
  >
    <UploadListItems
      v-model="images"
      :all-tags="tags"
      @remove="item => images.splice(images.indexOf(item), 1)"
    />
  </div>
</template>
