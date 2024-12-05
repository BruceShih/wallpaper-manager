<script setup lang="ts" generic="T">
import type { Column } from '@tanstack/vue-table'
import { cn } from '~/lib/utils'

interface TableColumnHeaderProps {
  column: Column<T, unknown>
  title: string
}

defineProps<TableColumnHeaderProps>()
</script>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<template>
  <div
    v-if="column.getCanSort()"
    :class="cn('flex items-center space-x-2', $attrs.class ?? '')"
  >
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button
          class="-ml-3 h-8 data-[state=open]:bg-accent"
          size="sm"
          variant="ghost"
        >
          <span>{{ title }}</span>
          <Icon
            v-if="column.getIsSorted() === 'desc'"
            class="ml-2 size-4"
            name="radix-icons:arrow-down"
          />
          <Icon
            v-else-if=" column.getIsSorted() === 'asc'"
            class="ml-2 size-4"
            name="radix-icons:arrow-up"
          />
          <Icon
            v-else
            class="ml-2 size-4"
            name="radix-icons:caret-sort"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem @click="column.toggleSorting(false)">
          <Icon
            class="mr-2 size-3.5 text-muted-foreground/70"
            name="radix-icons:arrow-up"
          />
          Asc
        </DropdownMenuItem>
        <DropdownMenuItem @click="column.toggleSorting(true)">
          <Icon
            class="mr-2 size-3.5 text-muted-foreground/70"
            name="radix-icons:arrow-down"
          />
          Desc
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>

  <div
    v-else
    :class="$attrs.class"
  >
    {{ title }}
  </div>
</template>
