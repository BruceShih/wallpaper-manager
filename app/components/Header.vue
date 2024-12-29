<script setup lang="ts">
import { cn } from '@/lib/utils'

const { client } = useAuth()
const session = client.useSession()
const colorMode = useColorMode()

async function onSignOut() {
  await client.signOut({
    fetchOptions: {
      onSuccess: async () => {
        await navigateTo('/')
      }
    }
  })
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
      <HeaderNav v-if="session.data" />
      <div class="ml-auto flex items-center space-x-2 px-6 lg:space-x-4">
        <Button
          v-if="session.data"
          color="black"
          size="icon"
          variant="ghost"
          @click="onSignOut"
        >
          <Icon name="lucide:log-out" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button
              size="icon"
              variant="ghost"
            >
              <Icon
                class="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                name="lucide:moon"
              />
              <Icon
                class="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
                name="lucide:sun"
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
