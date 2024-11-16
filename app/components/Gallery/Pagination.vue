<script lang="ts" setup>
const props = defineProps<{
  total: number
}>()
const emit = defineEmits(['change'])
const modelValue = defineModel<number>('page')
</script>

<template>
  <div class="flex items-center justify-end space-x-4">
    <div class="mx-4">
      Page {{ modelValue }} of {{ props.total }}
    </div>
    <Pagination
      v-model:page="modelValue"
      show-edges
      :total="props.total"
      @update:page="emit('change', $event)"
    >
      <PaginationList
        class="flex items-center gap-2"
      >
        <PaginationFirst />
        <PaginationPrev />
        <PaginationNext />
        <PaginationLast />
      </PaginationList>
    </Pagination>
  </div>
</template>
