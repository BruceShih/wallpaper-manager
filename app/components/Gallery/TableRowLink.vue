<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import type { WallpaperAndTags } from './types'
import { cn } from '~/lib/utils'

interface GalleryTableRowLinkProps {
  row: Row<WallpaperAndTags>
}

const { row } = defineProps<GalleryTableRowLinkProps>()

const config = useRuntimeConfig()
const src = ref(`${config.public.imageOrigin}/${row.original.key}`)
const img = useImage()
const _srcset = computed(() => {
  return img.getSizes(`${config.public.imageOrigin}/${row.original.key}`, {
    sizes: '256px',
    modifiers: {
      format: 'webp',
      quality: 70
    }
  })
})
</script>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<template>
  <HoverCard>
    <HoverCardTrigger as-child>
      <a
        :class="cn(row.original.alive
          ? 'flex items-center space-x-2'
          : 'text-muted flex items-center space-x-2', $attrs.class ?? '')"
        :href="`${config.public.imageOrigin}/${row.original.key}`"
        target="_blank"
      >
        <span>{{ row.original.key }}</span>
        <Icon name="radix-icons:external-link" />
      </a>
    </HoverCardTrigger>
    <HoverCardContent
      class="w-64"
      side="right"
    >
      <v-img
        :lazy-src="img(src, { quality: 70 })"
        :sizes="_srcset.sizes"
        :src="img(src, { quality: 70 })"
        :srcset="_srcset.srcset"
      />
    </HoverCardContent>
  </HoverCard>
</template>
