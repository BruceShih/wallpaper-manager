<script setup lang="ts">
import {
  Button
} from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PaginationPrev, type PaginationPrevProps } from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

const props = withDefaults(defineProps<PaginationPrevProps & { class?: HTMLAttributes['class'] }>(), {
  asChild: true
})

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <PaginationPrev v-bind="delegatedProps">
    <Button
      :class="cn('w-10 h-10 p-0', props.class)"
      variant="outline"
    >
      <slot>
        <Icon
          class="size-4"
          name="lucide:chevron-left"
        />
      </slot>
    </Button>
  </PaginationPrev>
</template>
