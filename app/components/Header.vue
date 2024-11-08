<script setup lang="ts">
const { signOut, loggedIn } = useAuth()
const colorMode = useColorMode()
</script>

<template>
  <header class="backdrop-blur sticky top-0 z-50">
    <div class="mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 h-16">
      <div class="lg:flex-1 flex items-center gap-1.5 min-w-0 text-lg font-semibold">
        Wallpaper Manager
      </div>
      <div class="flex items-center justify-end lg:flex-1 gap-1.5">
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="outline">
              <Icon name="radix-icons:moon" class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Icon name="radix-icons:sun" class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
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
        <Button
          v-if="loggedIn" color="black" @click="signOut({ redirectTo: '/' })"
        >
          Sign Out
        </Button>
      </div>
    </div>
  </header>
</template>
