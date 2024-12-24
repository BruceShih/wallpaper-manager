<script setup lang="ts">
import type { UploadListItem } from '~/components/Upload/types'

useHead({
  title: 'Upload - Wallpaper Manager'
})

const tagStore = useTagStore()
const wallpaperStore = useWallpaperStore()

const uploading = ref(false)
const selectAll = ref(false)
const imagesToUpload = reactive<UploadListItem[]>([])

const totalImageSelected = computed(() => imagesToUpload.filter(image => image.selected).length)

function onFileSelected(files: File[]) {
  const newFiles = files.filter(file => !imagesToUpload.some(image => image.image?.name === file.name))
  imagesToUpload.push(...newFiles.map(
    file => ({ image: file, tags: [], selected: false, status: 'not-started' } satisfies UploadListItem)
  ))
}
async function onUpload() {
  const promises: Promise<unknown>[] = []
  uploading.value = true

  const isSomeSelected = imagesToUpload.some(image => image.selected)
  if (isSomeSelected) {
    imagesToUpload.forEach((image) => {
      if (image.selected) {
        image.status = 'uploading'
        promises.push(
          wallpaperStore.uploadWallpaper(
            { id: image.image.name, tags: image.tags, body: image.image },
            () => {
              image.status = 'uploaded'
              useTimeoutFn(() => {
                imagesToUpload.splice(imagesToUpload.indexOf(image), 1)
              }, 10000).start()
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
    imagesToUpload.forEach((image) => {
      image.status = 'uploading'
      promises.push(
        wallpaperStore.uploadWallpaper(
          { id: image.image.name, tags: image.tags, body: image.image },
          () => {
            image.status = 'uploaded'
            useTimeoutFn(() => {
              imagesToUpload.splice(imagesToUpload.indexOf(image), 1)
            }, 10000).start()
          },
          () => {
            image.status = 'failed'
          }
        )
      )
    })
  }

  try {
    await Promise.allSettled(promises)
    uploading.value = false
    selectAll.value = false
  }
  catch (error) {
    console.error(error)
  }
}
function onTagsApply(tags: string[]) {
  imagesToUpload.forEach((image) => {
    if (image.selected) {
      // this is to prevent image.tags from being reactive
      image.tags = [...tags]
    }
  })
}

watch(selectAll, () => {
  imagesToUpload.forEach((image) => {
    image.selected = selectAll.value
  })
})

onMounted(async () => {
  if (tagStore.tags.length === 0)
    await tagStore.fetchTags()
})
</script>

<template>
  <div class="space-y-4">
    <UploadList
      v-model:images="imagesToUpload"
      :tags="tagStore.tags"
    >
      <template #toolbar>
        <UploadListToolbar
          v-model:select-all="selectAll"
          :all-tags="tagStore.tags"
          :image-selected="totalImageSelected"
          :number-of-images-to-upload="imagesToUpload.length"
          :uploading="uploading"
          @change="onFileSelected"
          @tags-apply="onTagsApply"
          @upload="onUpload"
        />
      </template>
    </UploadList>
  </div>
</template>
