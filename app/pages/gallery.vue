<script setup lang="ts">
import type { Image } from '~~/server/utils/drizzle'
import { useToast } from '~/components/ui/toast/use-toast'

definePageMeta({
  auth: import.meta.dev
    ? false
    : { only: 'user' }
})

const { toast } = useToast()

const token = ref(import.meta.client ? localStorage.getItem('bearer_token') || '' : '')
const isDev = ref(import.meta.dev)
const name = ref('')
const sort = ref<'date' | 'name'>('date')
const order = ref<'asc' | 'desc'>('asc')
const loading = ref(false)

const wallpapers = reactive<{
  images: Image[]
  page: number
  size: number
  total: number
}>({
  images: [],
  page: 1,
  size: 20,
  total: 1
})

async function fetchData() {
  wallpapers.images = []

  const { data } = await useFetch('/api/list', {
    headers: {
      Authorization: `Bearer ${token.value}`
    },
    query: {
      page: wallpapers.page,
      size: wallpapers.size,
      name: name.value,
      sort: sort.value,
      order: order.value
    },
    onResponse({ response }) {
      const total = response.headers.get('total')
      if (total)
        wallpapers.total = Number.parseInt(total, 10)
    }
  })
  wallpapers.images = data.value || []
}
async function onFavoriteClick(image: Image) {
  const { error } = await useFetch(`/api/image/update/${image.key}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token.value}`
    },
    body: JSON.stringify({ favorite: !image.favorite })
  })

  if (error.value) {
    toast({
      title: 'Failed to update wallpaper',
      variant: 'destructive'
    })
  }
  else {
    image.favorite = !image.favorite

    toast({
      title: 'Image liked'
    })
  }
}
async function onDeleteClick(image: Image) {
  const { error } = await useFetch(`/api/delete/${image.key}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token.value}`
    }
  })

  if (error.value) {
    toast({
      title: 'Failed to delete wallpaper',
      variant: 'destructive'
    })
  }
  else {
    const index = wallpapers.images.findIndex(item => item.key === image.key)
    wallpapers.images.splice(index, 1)

    toast({
      title: 'Image deleted'
    })
  }
}
async function onSearch() {
  await fetchData()
}
async function onPageChange() {
  await fetchData()
}
</script>

<template>
  <div class="space-y-4">
    <GalleryFilter
      v-model:loading="loading"
      v-model:name="name"
      v-model:order="order"
      v-model:sort="sort"
      @search="onSearch"
    />
    <div
      v-auto-animate
      class="grid grid-flow-row grid-cols-2 place-items-center justify-center gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
    >
      <Card
        v-for="(image, index) in wallpapers.images"
        :key="index"
        class="w-44 md:w-56"
      >
        <CardHeader>
          <CardTitle class="truncate text-base font-semibold">
            {{ image.key }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <!-- TODO: dev only, remove later -->
          <template v-if="isDev">
            <img
              alt="placeholder"
              src="https://picsum.photos/120"
            >
          </template>
          <template v-else>
            <NuxtImg
              class="aspect-square object-cover"
              :class="{ blur: image.nsfw }"
              loading="lazy"
              placeholder
              provider="cloudflare"
              :src="`/source/${image.key}`"
            />
          </template>
        </CardContent>
        <CardFooter class="justify-start">
          <Button
            size="icon"
            variant="ghost"
            @click="onFavoriteClick(image)"
          >
            <Icon
              v-if="image.favorite"
              class="text-red-500"
              name="radix-icons:heart-filled"
            />
            <Icon
              v-else
              class="text-red-500"
              name="radix-icons:heart"
            />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            @click="onDeleteClick(image)"
          >
            <Icon name="radix-icons:trash" />
          </Button>
          <Badge
            v-if="image.nsfw"
            class="ml-auto"
            variant="destructive"
          >
            nsfw
          </Badge>
        </CardFooter>
      </Card>
    </div>
    <GalleryPagination
      v-model:page="wallpapers.page"
      :total="wallpapers.total"
      @change="onPageChange"
    />
  </div>
</template>
