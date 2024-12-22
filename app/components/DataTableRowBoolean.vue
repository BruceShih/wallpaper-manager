<script setup lang="ts">
import { cn } from '~/lib/utils'

interface DataTableRowBooleanProps {
  isTrue: boolean
}

defineProps<DataTableRowBooleanProps>()
</script>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<template>
  <div :class="cn('flex items-center', $attrs.class ?? '')">
    <span v-if="isTrue">🟢</span>
    <span v-else>🔴</span>
  </div>
</template>
