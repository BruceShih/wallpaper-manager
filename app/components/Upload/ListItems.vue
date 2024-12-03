<script setup lang="ts">
import type { Tag } from '~~/server/utils/drizzle'
import { ListItemTagSelect, type UploadListItem } from '.'

interface UploadListItemProps {
  allTags: Tag[]
}

const { allTags } = defineProps<UploadListItemProps>()
const emits = defineEmits<{
  remove: [item: UploadListItem]
}>()
const modelValue = defineModel<UploadListItem[]>({ required: true })

function getImagePreview(image: File | null) {
  if (!image)
    return ''
  return URL.createObjectURL(image)
}
</script>

<template>
  <Card
    v-for="(item, index) in modelValue"
    :key="index"
    :class="{ 'border-2 border-blue-500': item.selected }"
    @click.prevent="item.selected = !item.selected"
  >
    <CardHeader>
      <CardTitle class="flex items-center justify-between text-sm">
        <div class="w-4/5 truncate">
          {{ item.image?.name }}
        </div>
        <Button
          class="size-8"
          size="icon"
          variant="outline"
          @click="emits('remove', item)"
        >
          <Icon
            class="size-4"
            name="radix-icons:cross-2"
          />
        </Button>
      </CardTitle>
    </CardHeader>
    <CardContent class="relative">
      <img
        alt="image preview"
        class="h-40 w-full rounded-md object-cover"
        :src="getImagePreview(item.image)"
      >
      <div
        class="absolute inset-0 flex items-center justify-center bg-black opacity-50 transition-all
          hover:opacity-0"
      >
        <Icon
          v-if="item.status === 'failed'"
          class="size-8 text-red-500"
          name="radix-icons:cross-circled"
        />
        <Icon
          v-if="item.status === 'not-started'"
          class="size-8"
          name="radix-icons:question-mark-circled"
        />
        <Icon
          v-if="item.status === 'uploaded'"
          class="size-8 text-green-400"
          name="radix-icons:check-circled"
        />
        <Icon
          v-if="item.status === 'uploading'"
          class="size-8 animate-spin"
          name="radix-icons:reload"
        />
      </div>
    </CardContent>
    <CardFooter class="flex items-center justify-between space-x-2 px-6 pb-6">
      <ListItemTagSelect
        v-model="item.tags"
        :tags="allTags"
      />
    </CardFooter>
  </Card>
</template>
