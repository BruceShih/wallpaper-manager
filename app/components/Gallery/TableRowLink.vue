<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import type { WallpaperAndTags } from './types'
import { cn } from '~/lib/utils'

interface GalleryTableRowLinkProps {
  row: Row<WallpaperAndTags>
}

const { row } = defineProps<GalleryTableRowLinkProps>()

const config = useRuntimeConfig()
</script>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<template>
  <div :class="cn('flex items-center space-x-2', $attrs.class ?? '')">
    <span :class="{ 'text-muted': row.original.alive }">
      {{ row.original.key }}
    </span>
    <HoverCard>
      <HoverCardTrigger as-child>
        <a
          class="flex items-center"
          :href="`${config.public.imageOrigin}/${row.original.key}`"
          target="_blank"
        >
          <Icon name="radix-icons:external-link" />
        </a>
      </HoverCardTrigger>
      <HoverCardContent
        class="sm:w-32 xl:w-64"
        side="right"
      >
        <NuxtImg
          loading="lazy"
          :modifiers="{ format: 'webp', quality: 70 }"
          provider="cloudflare"
          sizes="sm:128px xl:256px"
          :src="`/${row.original.key}`"
        />
      </HoverCardContent>
    </HoverCard>
  </div>
</template>
