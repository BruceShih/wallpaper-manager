<script setup lang="ts">
import type { Tag } from '~~/server/types/drizzle'
import { ComboboxAnchor, ComboboxContent, ComboboxInput, ComboboxPortal, ComboboxRoot } from 'radix-vue'

interface UploadListItemTagSelectProps {
  tags: Tag[]
}

const props = defineProps<UploadListItemTagSelectProps>()
const modelValue = defineModel<string[]>({ required: true })

const open = ref(false)
const searchTerm = ref('')

const tags = computed(() => props.tags.map(t => ({ label: t.tag, value: t.id })))
const filteredTags = computed(() => tags.value.filter(i => !modelValue.value.includes(i.label)))
</script>

<template>
  <TagsInput
    class="relative w-[250px] gap-0 px-0"
    :model-value="modelValue"
  >
    <div class="flex flex-wrap items-center gap-2 px-3">
      <TagsInputItem
        v-for="item in modelValue"
        :key="item"
        :value="item"
      >
        <TagsInputItemText />
        <TagsInputItemDelete />
      </TagsInputItem>
    </div>

    <ComboboxRoot
      v-model="modelValue"
      v-model:open="open"
      v-model:search-term="searchTerm"
      class="w-full"
    >
      <ComboboxAnchor as-child>
        <ComboboxInput
          as-child
          placeholder="Tags..."
        >
          <TagsInputInput
            class="w-full px-3"
            :class="modelValue.length > 0 ? 'mt-2' : ''"
            @keydown.enter.prevent
          />
        </ComboboxInput>
      </ComboboxAnchor>
      <ComboboxPortal>
        <ComboboxContent>
          <CommandList
            class="mt-2 w-[--radix-popper-anchor-width] rounded-md border bg-popover text-popover-foreground
              shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out
              data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95
              data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2
              data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2
              data-[side=top]:slide-in-from-bottom-2"
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
                    searchTerm = ''
                    modelValue.push(ev.detail.value)
                  }

                  if (filteredTags.length === 0) {
                    open = false
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
</template>
