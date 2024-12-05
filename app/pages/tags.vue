<script setup lang="ts">
import { z } from 'zod'
import { tags } from '~~/server/database/schema'

if (import.meta.dev) {
  definePageMeta({
    auth: false
  })
}

const store = useTagStore()
const formSchema = toTypedSchema(z.object({
  name: z.string(),
  sensitive: z.boolean()
}))
const form = useForm({
  validationSchema: formSchema
})

const createLoading = ref(false)
const deleteLoading = ref(false)
const selectedTagId = ref(-1)

async function onDelete(id: number) {
  if (selectedTagId.value === -1)
    return
  if (deleteLoading.value)
    return
  deleteLoading.value = true
  await store.deleteTag(id)
  deleteLoading.value = false
}
const onCreate = form.handleSubmit(async (values) => {
  if (createLoading.value)
    return
  createLoading.value = true
  await store.createTag({ name: values.name, sensitive: values.sensitive })
  createLoading.value = false
})

onMounted(async () => {
  await store.fetchTags()
})
</script>

<template>
  <div class="grid grid-cols-4 gap-4">
    <Card class="col-start-1 col-end-4">
      <CardHeader>
        <CardTitle>Existed tags</CardTitle>
        <CardDescription>List of currently have tags.</CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog>
          <DialogTrigger as-child>
            <div class="flex flex-wrap items-center gap-2">
              <Badge
                v-for="tag in store.tags"
                :key="tag.id"
                class="flex cursor-pointer items-center"
                :variant="tag.sensitive ? 'destructive' : 'default'"
                @click="selectedTagId = tag.id"
              >
                <span>{{ tag.tag }}</span>
                <Icon
                  class="ml-1"
                  name="radix-icons:cross-2"
                />
              </Badge>
            </div>
          </DialogTrigger>
          <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete tag</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this tag?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="destructive"
                @click="onDelete(selectedTagId)"
              >
                Delete
              </Button>
              <Button variant="secondary">
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
    <Card class="col-start-4 col-end-5 flex flex-col justify-start">
      <CardHeader>
        <CardTitle>Create new tag</CardTitle>
        <CardDescription>Enter a new tag below.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          class="flex flex-col justify-between gap-y-4"
          @submit.prevent="onCreate"
        >
          <FormField
            v-slot="{ componentField }"
            name="name"
          >
            <FormItem>
              <FormLabel for="name">
                Tag Name
              </FormLabel>
              <FormControl>
                <Input
                  id="name"
                  class="h-8"
                  v-bind="componentField"
                  placeholder="Name of the tag"
                  type="text"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ value, handleChange }"
            name="sensitive"
            type="checkbox"
          >
            <FormItem class="flex flex-row items-start gap-x-1 space-y-0">
              <FormControl>
                <Checkbox
                  id="sensitive"
                  :checked="value"
                  class="mr-2"
                  @update:checked="handleChange"
                />
              </FormControl>
              <div class="space-y-1 leading-none">
                <FormLabel>Sensitive</FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          </FormField>
          <Button
            class="mt-auto"
            type="submit"
          >
            <Icon
              v-if="createLoading"
              class="animate-spin"
              name="radix-icons:reload"
            />
            <template v-if="createLoading">
              Creating...
            </template>
            <template v-else>
              Create
            </template>
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
