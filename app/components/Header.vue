<script setup lang="ts">
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'

const { signOut, loggedIn } = useAuth()
const colorMode = useColorMode()

const links = [
  { href: '/gallery', text: 'Gallery' },
  { href: '/token', text: 'Token' }
]
</script>

<template>
  <header class="sticky top-0 z-50 backdrop-blur">
    <div class="mx-auto flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
      <div class="flex min-w-0 items-center gap-1.5 text-lg font-semibold lg:flex-1">
        Wallpaper Manager
      </div>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem
            v-for="(link, index) in links"
            :key="index"
          >
            <NuxtLink :to="link.href">
              <NavigationMenuLink
                :class="navigationMenuTriggerStyle()"
              >
                {{ link.text }}
              </NavigationMenuLink>
            </NuxtLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div class="flex items-center justify-end lg:flex-1">
        <Button
          v-if="loggedIn"
          variant="ghost"
          color="black"
          @click="signOut({ redirectTo: '/' })"
        >
          <Icon name="radix-icons:exit" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="ghost">
              <Icon
                name="radix-icons:moon"
                class="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
              />
              <Icon
                name="radix-icons:sun"
                class="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
              />
              <span class="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem @click="colorMode.preference = 'light'">
              Light
            </DropdownMenuItem>
            <DropdownMenuItem @click="colorMode.preference = 'dark'">
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem @click="colorMode.preference = 'system'">
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </header>
</template>
