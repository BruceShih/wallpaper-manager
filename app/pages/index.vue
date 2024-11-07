<script setup lang="ts">
definePageMeta({
  auth: {
    only: 'guest',
    redirectUserTo: '/gallery'
  }
})

const auth = useAuth()
</script>

<template>
  <UContainer class="flex justify-center">
    <UCard class="w-56">
      <template #header>
        Login
      </template>
      <UButton
        icon="i-simple-icons-github"
        type="button"
        color="neutral"
        @click="auth.signIn.social({ provider: 'github', callbackURL: '/gallery' })"
      >
        Sign In with Github
      </UButton>
    </UCard>
  </UContainer>
</template>
