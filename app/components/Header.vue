<script setup lang="ts">
const { signOut, loggedIn } = useAuth()
</script>

<template>
  <header class="backdrop-blur sticky top-0 z-50">
    <div class="mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 h-16">
      <div class="lg:flex-1 flex items-center gap-1.5 min-w-0">
        Wallpaper Manager
      </div>
      <div class="flex items-center justify-end lg:flex-1 gap-1.5">
        <UButton v-if="loggedIn" color="neutral" @click="signOut({ redirectTo: '/' })">
          Sign Out
        </UButton>
      </div>
    </div>
  </header>
</template>
