<script setup lang="ts">
import { cn } from '@/lib/utils'

const { signOut, loggedIn } = useAuth()
const colorMode = useColorMode()

function onSignOut() {
  if (import.meta.dev)
    localStorage.removeItem('bearer_token')
  signOut({ redirectTo: '/' })
}
</script>

<template>
  <header
    :class="cn('sticky top-0 border-b backdrop-blur z-50', $attrs.class ?? '')"
  >
    <div class="flex h-16 items-center">
      <div class="flex items-center px-6 text-lg font-semibold">
        Wallpaper Manager
      </div>
      <HeaderNav />
      <div class="ml-auto flex items-center space-x-2 px-6 lg:space-x-4">
        <Button
          v-if="loggedIn"
          color="black"
          size="icon"
          variant="ghost"
          @click="onSignOut"
        >
          <Icon name="radix-icons:exit" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button
              size="icon"
              variant="ghost"
            >
              <Icon
                class="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                name="radix-icons:moon"
              />
              <Icon
                class="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
                name="radix-icons:sun"
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
