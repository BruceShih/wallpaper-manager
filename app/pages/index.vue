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
  <div class="flex justify-center">
    <Card class="w-[350px]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          @click="auth.signIn.social({ provider: 'github', callbackURL: '/gallery' })"
        >
          Sign In with Github
        </Button>
      </CardContent>
    </Card>
  </div>
</template>
