<script setup lang="ts">
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

// FIXME: local dev code, remove after
const randomDate = (start: Date, end: Date) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))

async function fetchData() {
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

    return
  }

  const { data } = await useFetch('/api/list', {
    query: { page: wallpapers.page, size: wallpapers.size },
    onResponse({ response }) {
      const total = response.headers.get('total')
      if (total)
        wallpapers.total = Number.parseInt(total, 10)
    }
  })
  wallpapers.images = data.value || []
}
function onPageChange(page: number) {
  wallpapers.page = page
  fetchData()
}

onMounted(async () => {
  try {
    fetchData()
  }
  catch (error) {
    console.error(error)
  }
})
</script>

<template>
  <div class="grid gap-4 grid-cols-6 grid-flow-row place-items-center justify-center mx-4">
    <Card v-for="(image, index) in wallpapers.images" :key="index" v-auto-animate class="w-56">
      <CardHeader>
        <CardTitle class="text-base font-semibold truncate">
          {{ image.key }}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <!-- TODO: image preview goes here -->
        <Skeleton class="w-full h-64" />
      </CardContent>
      <CardFooter class="justify-start">
        <Button variant="ghost" size="icon">
          <Icon v-if="image.favorite" name="radix-icons:heart-filled" class="text-red-500" />
          <Icon v-else name="radix-icons:heart" class="text-red-500" />
        </Button>
        <Button variant="ghost" size="icon">
          <Icon name="radix-icons:trash" />
        </Button>
        <Badge v-if="image.nsfw" variant="destructive" class="ml-auto">
          nsfw
        </Badge>
      </CardFooter>
    </Card>
  </div>
  <div class="flex justify-center items-center my-6">
    <Pagination
      v-slot="{ page }"
      v-model:page="wallpapers.page"
      show-edges
      :total="wallpapers.total"
      :sibling-count="1"
      :default-page="2"
      @update:page="onPageChange"
    >
      <PaginationList v-slot="{ items }" class="flex items-center gap-1">
        <PaginationFirst />
        <PaginationPrev />

        <template v-for="(item, index) in items">
          <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
            <Button class="w-10 h-10 p-0" :variant="item.value === page ? 'default' : 'outline'">
              {{ item.value }}
            </Button>
          </PaginationListItem>
          <PaginationEllipsis v-else :key="item.type" :index="index" />
        </template>

        <PaginationNext />
        <PaginationLast />
      </PaginationList>
    </Pagination>
  </div>
</template>
