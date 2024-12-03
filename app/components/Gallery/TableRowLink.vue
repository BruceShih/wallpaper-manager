<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import type { WallpaperAndTags } from './types'
import { cn } from '~/lib/utils'

interface GalleryTableRowLinkProps {
  row: Row<WallpaperAndTags>
}

defineProps<GalleryTableRowLinkProps>()

const config = useRuntimeConfig()
</script>

<template>
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
</template>
