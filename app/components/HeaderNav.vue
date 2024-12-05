<script setup lang="ts">
import { cn } from '@/lib/utils'

const links = [
  { href: '/gallery', text: 'Gallery' },
  { href: '/tags', text: 'Tags' },
  { href: '/upload', text: 'Upload' },
  { href: '/token', text: 'Token' }
]
</script>

<template>
  <nav
    :class="cn('flex items-center space-x-2 lg:space-x-4 px-6', $attrs.class ?? '')"
  >
    <NuxtLink
      v-for="(link, index) in links"
      :key="index"
      active-class="text-slate-200"
      class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      :to="link.href"
    >
      {{ link.text }}
    </NuxtLink>
  </nav>
</template>
