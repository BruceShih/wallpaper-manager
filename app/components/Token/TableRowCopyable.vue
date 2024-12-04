<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import type { UserToken } from '~~/server/utils/drizzle'
import { cn } from '~/lib/utils'

interface GalleryTableRowLinkProps {
  row: Row<UserToken>
}

defineProps<GalleryTableRowLinkProps>()

const { copy } = useClipboard()
const { start } = useTimeoutFn(() => {
  open.value = false
}, 2000)

const open = ref(false)
</script>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<template>
  <div
    :class="cn(row.original.enabled
      ? 'flex items-center space-x-2'
      : 'flex items-center space-x-2 text-muted', $attrs.class ?? '')"
  >
    <pre>{{ row.original.token }}</pre>
    <TooltipProvider>
      <Tooltip
        :disable-hoverable-content="true"
        :open="open"
      >
        <TooltipTrigger as-child>
          <Button
            size="icon"
            variant="ghost"
            @click="() => {
              open = true
              copy(row.original.token)
              start()
            }"
          >
            <Icon name="radix-icons:copy" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <span>Copied!</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
</template>
