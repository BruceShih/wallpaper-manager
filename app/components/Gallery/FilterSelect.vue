<script setup lang="ts">
// TODO: WIP component
import type { Column } from '@tanstack/vue-table'
import type { Image } from '~~/server/utils/drizzle'
import { cn } from '@/lib/utils'
import { computed } from 'vue'

interface DataTableFacetedFilterOption {
  label: string
  value: string
}

interface DataTableFacetedFilter {
  column?: Column<Image, unknown>
  title?: string
  options: DataTableFacetedFilterOption[]
}

const props = defineProps<DataTableFacetedFilter>()

const facets = computed(() => props.column?.getFacetedUniqueValues())
const selectedValues = computed(() => new Set(props.column?.getFilterValue() as string[]))

function onComboItemSelected(option: DataTableFacetedFilterOption) {
  const isSelected = selectedValues.value.has(option.value)
  if (isSelected) {
    selectedValues.value.delete(option.value)
  }
  else {
    selectedValues.value.add(option.value)
  }
  const filterValues = Array.from(selectedValues.value)
  props.column?.setFilterValue(
    filterValues.length ? filterValues : undefined
  )
}
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        class="h-8 border-dashed"
        size="sm"
        variant="outline"
      >
        <Icon
          class="mr-2 size-4"
          name="radix-icons:plus-circled"
        />
        {{ title }}
        <template v-if="selectedValues.size > 0">
          <Separator
            class="mx-2 h-4"
            orientation="vertical"
          />
          <Badge
            class="rounded-sm px-1 font-normal lg:hidden"
            variant="secondary"
          >
            {{ selectedValues.size }}
          </Badge>
          <div class="hidden space-x-1 lg:flex">
            <Badge
              v-if="selectedValues.size > 2"
              class="rounded-sm px-1 font-normal"
              variant="secondary"
            >
              {{ selectedValues.size }} selected
            </Badge>

            <template v-else>
              <Badge
                v-for="option in options
                  .filter((option) => selectedValues.has(option.value))"
                :key="option.value"
                class="rounded-sm px-1 font-normal"
                variant="secondary"
              >
                {{ option.label }}
              </Badge>
            </template>
          </div>
        </template>
      </Button>
    </PopoverTrigger>
    <PopoverContent
      align="start"
      class="w-[200px] p-0"
    >
      <Command>
        <!-- <CommandInput :placeholder="title" /> -->
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="option in options"
              :key="option.value"
              :value="option"
              @select="onComboItemSelected(option)"
            >
              <div
                :class="cn(
                  'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                  selectedValues.has(option.value)
                    ? 'bg-primary text-primary-foreground'
                    : 'opacity-50 [&_svg]:invisible',
                )"
              >
                <Icon
                  :class="cn('h-4 w-4')"
                  name="radix-icons:check"
                />
              </div>
              <span>{{ option.label }}</span>
              <span
                v-if="facets?.get(option.value)"
                class="ml-auto flex size-4 items-center justify-center font-mono text-xs"
              >
                {{ facets.get(option.value) }}
              </span>
            </CommandItem>
          </CommandGroup>

          <template v-if="selectedValues.size > 0">
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                class="justify-center text-center"
                :value="{ label: 'Clear filters' }"
                @select="column?.setFilterValue(undefined)"
              >
                Clear filters
              </CommandItem>
            </CommandGroup>
          </template>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
