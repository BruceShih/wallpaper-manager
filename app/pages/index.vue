<script setup lang="ts">
import { z } from 'zod'
import { useToast } from '~/components/ui/toast/use-toast'

definePageMeta({
  auth: {
    only: 'guest',
    redirectUserTo: '/gallery'
  }
})

useHead({
  title: 'Wallpaper Manager'
})

const auth = useAuth()
const formSchema = toTypedSchema(z.object({
  email: z.string().min(2).max(50).email(),
  password: z.string().min(6).max(50)
}))
const form = useForm({
  validationSchema: formSchema
})
const { toast } = useToast()

const loading = ref(false)

const onLogin = form.handleSubmit(async (values) => {
  if (loading.value)
    return
  loading.value = true
  const { error } = await auth.signIn.email({
    email: values.email,
    password: values.password
  })

  if (error) {
    toast({
      title: 'Login failed',
      variant: 'destructive'
    })
  }
  else {
    if (import.meta.client) {
      const session = await auth.fetchSession()
      if (session)
        localStorage.setItem('bearer_token', session.session.id)
    }
    await navigateTo('/gallery')
  }
  loading.value = false
})
</script>

<template>
  <div class="flex justify-center">
    <Card class="w-[400px]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          class="space-y-6"
          @submit.prevent="onLogin"
        >
          <FormField
            v-slot="{ componentField }"
            name="email"
          >
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ componentField }"
            name="password"
          >
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <Button
            :disabled="loading"
            type="submit"
          >
            <Icon
              v-if="loading"
              class="animate-spin"
              name="lucide:rotate-cw"
            />
            <template v-if="loading">
              Logging in...
            </template>
            <template v-else>
              Login
            </template>
          </Button>
        </form>
        <DevOnly>
          <Separator
            class="my-6"
            label="Or"
            orientation="horizontal"
          />
          <Button
            type="button"
            variant="secondary"
            @click="auth.signIn.social({ provider: 'github', callbackURL: '/gallery' })"
          >
            <Icon name="lucide:github" />
            Sign In with Github
          </Button>
        </DevOnly>
      </CardContent>
    </Card>
  </div>
</template>
