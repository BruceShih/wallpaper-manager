<script setup lang="ts">
const images = ref<Image[]>()
const page = ref(1)
const size = ref(20)

onMounted(async () => {
  try {
    const data = await $fetch('/api/list', {
      query: { page: page.value, size: size.value }
    })

    images.value = data
  }
  catch (error) {
    console.error(error)
  }
})
</script>

<template>
  <div class="grid gap-4 grid-cols-6 grid-flow-row place-items-center justify-center mx-4">
    <Card v-for="(image, index) in images" :key="index" v-auto-animate class="w-56">
      <CardHeader>
        <CardTitle>{{ image.key }}</CardTitle>
      </CardHeader>
      <CardContent>
        <!-- TODO: image preview goes here -->
        <Skeleton class="w-full h-64" />
      </CardContent>
      <CardFooter class="justify-between">
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
</template>
