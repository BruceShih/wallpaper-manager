<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import type { WallpaperAndTags } from './types'
import { ComboboxAnchor, ComboboxContent, ComboboxInput, ComboboxPortal, ComboboxRoot } from 'radix-vue'

interface GalleryTableRowActionsProps {
  row: Row<WallpaperAndTags>
}

const props = defineProps<GalleryTableRowActionsProps>()
const emits = defineEmits<{
  edit: [data: {
    key: string
    favorite: boolean
    tags: number[]
  }]
}>()

const tagStore = useTagStore()

const tagComboboxOpen = ref(false)
const tagSearchTerm = ref('')
const editModels = reactive<{
  favorite: boolean
  tags: string[]
}>({
  favorite: false,
  tags: []
})

const allTags = computed(() => tagStore.tags.map(t => ({ label: t.tag, value: t.id.toString() })))
const filteredTags = computed(() => allTags.value.filter(i => !editModels.tags.includes(i.label)))

function onEditDialogOpen() {
  editModels.favorite = props.row.original.favorite
  editModels.tags = props.row.original.tags.map(t => t.tag)
}
function onEditSave() {
  emits('edit', {
    key: props.row.original.key,
    favorite: editModels.favorite,
    tags: tagStore.tags.filter(t => editModels.tags.includes(t.tag)).map(t => t.id)
  })

  editModels.favorite = false
  editModels.tags = []
}
</script>

<template>
  <Dialog
    @update:open="onEditDialogOpen"
  >
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button
          class="flex size-8 p-0 data-[state=open]:bg-muted"
          variant="ghost"
        >
          <Icon
            class="size-4"
            name="lucide:more-horizontal"
          />
          <span class="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        class="w-[160px]"
      >
        <DialogTrigger as-child>
          <DropdownMenuItem>
            Edit
          </DropdownMenuItem>
        </DialogTrigger>
        <!-- <DropdownMenuSeparator />
        <DropdownMenuItem @select="onDelete">
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem> -->
      </DropdownMenuContent>
    </DropdownMenu>
    <!-- Edit dialog -->
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>
          Edit {{ row.original.key }}
        </DialogTitle>
        <DialogDescription>
          Data is only saved when you click "Save changes"
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-6">
        <div class="space-y-2">
          <Label
            class="text-sm font-medium leading-none"
            for="tags"
          >
            Tags
          </Label>
          <TagsInput
            id="tags"
            class="w-80 gap-0 px-0"
            :model-value="editModels.tags"
          >
            <div class="flex flex-wrap items-center gap-2 px-3">
              <TagsInputItem
                v-for="item in editModels.tags"
                :key="item"
                :value="item"
              >
                <TagsInputItemText />
                <TagsInputItemDelete />
              </TagsInputItem>
            </div>

            <ComboboxRoot
              v-model="editModels.tags"
              v-model:open="tagComboboxOpen"
              v-model:search-term="tagSearchTerm"
              class="w-full"
            >
              <ComboboxAnchor as-child>
                <ComboboxInput
                  as-child
                  placeholder="Tag..."
                >
                  <TagsInputInput
                    class="w-full px-3"
                    :class="editModels.tags.length > 0 ? 'mt-2' : ''"
                    @keydown.enter.prevent
                  />
                </ComboboxInput>
              </ComboboxAnchor>

              <ComboboxPortal>
                <ComboboxContent>
                  <CommandList
                    class="mt-2 w-[--radix-popper-anchor-width] rounded-md border bg-popover
                      text-popover-foreground shadow-md outline-none data-[state=open]:animate-in
                      data-[state=closed]:animate-out data-[state=closed]:fade-out-0
                      data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
                      data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2
                      data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                    position="popper"
                  >
                    <CommandEmpty />
                    <CommandGroup>
                      <CommandItem
                        v-for="tag in filteredTags"
                        :key="tag.value"
                        :value="tag.label"
                        @select.prevent="(ev) => {
                          if (typeof ev.detail.value === 'string') {
                            tagSearchTerm = ''
                            editModels.tags.push(ev.detail.value)
                          }

                          if (filteredTags.length === 0) {
                            tagComboboxOpen = false
                          }
                        }"
                      >
                        {{ tag.label }}
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </ComboboxContent>
              </ComboboxPortal>
            </ComboboxRoot>
          </TagsInput>
        </div>
        <div class="flex items-center space-x-2">
          <Checkbox
            id="favorite"
            v-model:checked="editModels.favorite"
          />
          <Label for="favorite">
            Favorite
          </Label>
        </div>
        <DialogFooter>
          <Button @click="onEditSave">
            Save changes
          </Button>
        </DialogFooter>
      </div>
    </DialogContent>
  </Dialog>
</template>
