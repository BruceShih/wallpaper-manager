<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import type { UserToken } from '~~/server/types/drizzle'

interface TokenTableToolbarProps {
  table: Table<UserToken>
}

const props = defineProps<TokenTableToolbarProps>()

const isFiltered = computed(() => props.table.getState().columnFilters.length > 0)
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex flex-1 items-center space-x-2">
      <Button
        v-if="isFiltered"
        class="h-8 px-2 lg:px-3"
        variant="ghost"
        @click="table.resetColumnFilters()"
      >
        Reset
        <Icon
          class="ml-2 size-4"
          name="lucide:x"
        />
      </Button>
    </div>
    <TokenTableViewOptions :table="table" />
  </div>
</template>
