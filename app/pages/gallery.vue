<script setup lang="ts">
import type { Image } from '~~/server/utils/drizzle'
import { useToast } from '~/components/ui/toast/use-toast'

const { toast } = useToast()

const token = ref(import.meta.client ? localStorage.getItem('bearer_token') || '' : '')
const isDev = ref(import.meta.dev)
const loading = ref(false)
const name = ref('')
const sort = ref<'date' | 'name'>('date')
const order = ref<'asc' | 'desc'>('asc')
const wallpapers = reactive<{
  images: Image[]
  page: number
  size: number
  total: number
}>({
  images: [],
  page: 1,
  size: 20,
  total: 0
})

const sortByOptions = [
  { label: 'Date', value: 'date' },
  { label: 'Name', value: 'name' }
]
const orderByOptions = [
  { label: 'Ascending', value: 'asc' },
  { label: 'Descending', value: 'desc' }
]

// FIXME: local dev code, remove after
function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

async function fetchData() {
  loading.value = true
  wallpapers.images = []

  // FIXME: local dev code, remove after
  if (import.meta.dev) {
    wallpapers.images = Array.from({ length: 20 }, (_, index) => ({
      key: `Image ${wallpapers.page * (index + 1)}`,
      favorite: Math.floor(Math.random() * 2),
      nsfw: Math.floor(Math.random() * 2),
      alive: 1,
      createDate: randomDate(new Date(2023, 0, 1), new Date()).toISOString(),
      deleteDate: ''
    }))
    wallpapers.total = 101
    loading.value = false

    return
  }

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

  loading.value = false
}
function onSearch() {
  fetchData()
}
async function onFavoriteClick(image: Image) {
  const { error } = await useFetch(`/api/update/${image.key}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token.value}`
    },
    body: JSON.stringify({ favorite: image.favorite === 0 })
  })

  if (error.value) {
    toast({
      title: 'Update failed',
      variant: 'destructive'
    })
  }
  else {
    image.favorite = image.favorite === 0 ? 1 : 0

    toast({
      title: 'Image updated'
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
      title: 'Delete failed',
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
function onPageChange(page: number) {
  wallpapers.page = page
  fetchData()
}
</script>

<template>
  <div class="mx-4 mb-4 space-y-6">
    <div class="flex flex-wrap items-center justify-start gap-4 lg:justify-end">
      <Input
        v-model="name"
        type="text"
        placeholder="File name"
        class="w-[200px]"
      />
      <Select v-model="sort">
        <SelectTrigger class="w-[120px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sort by</SelectLabel>
            <SelectItem
              v-for="(item, index) in sortByOptions"
              :key="index"
              :value="item.value"
            >
              {{ item.label }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select v-model="order">
        <SelectTrigger class="w-[120px]">
          <SelectValue placeholder="Order by" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sort by</SelectLabel>
            <SelectItem
              v-for="(item, index) in orderByOptions"
              :key="index"
              :value="item.value"
            >
              {{ item.label }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button
        :disabled="loading"
        @click="onSearch"
      >
        <Icon
          v-if="loading"
          name="radix-icons:reload"
          class="animate-spin"
        />
        <template v-if="loading">
          Searching...
        </template>
        <template v-else>
          Search
        </template>
      </Button>
    </div>
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
              src="https://picsum.photos/120"
              alt="placeholder"
            >
          </template>
          <template v-else>
            <NuxtImg
              loading="lazy"
              :class="{ blur: image.nsfw }"
              :src="`/api/images/${image.key}`"
            />
          </template>
        </CardContent>
        <CardFooter class="justify-start">
          <Button
            variant="ghost"
            size="icon"
            @click="onFavoriteClick(image)"
          >
            <Icon
              v-if="image.favorite"
              name="radix-icons:heart-filled"
              class="text-red-500"
            />
            <Icon
              v-else
              name="radix-icons:heart"
              class="text-red-500"
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            @click="onDeleteClick(image)"
          >
            <Icon name="radix-icons:trash" />
          </Button>
          <Badge
            v-if="image.nsfw"
            variant="destructive"
            class="ml-auto"
          >
            nsfw
          </Badge>
        </CardFooter>
      </Card>
    </div>
    <div class="flex items-center justify-center">
      <Pagination
        v-slot="{ page }"
        v-model:page="wallpapers.page"
        show-edges
        :total="wallpapers.total"
        :sibling-count="1"
        :default-page="2"
        @update:page="onPageChange"
      >
        <PaginationList
          v-slot="{ items }"
          class="flex items-center gap-1"
        >
          <PaginationFirst />
          <PaginationPrev />

          <template v-for="(item, index) in items">
            <PaginationListItem
              v-if="item.type === 'page'"
              :key="index"
              :value="item.value"
              as-child
            >
              <Button
                class="size-10 p-0"
                :variant="item.value === page ? 'default' : 'outline'"
              >
                {{ item.value }}
              </Button>
            </PaginationListItem>
            <PaginationEllipsis
              v-else
              :key="item.type"
              :index="index"
            />
          </template>

          <PaginationNext />
          <PaginationLast />
        </PaginationList>
      </Pagination>
    </div>
  </div>
</template>
