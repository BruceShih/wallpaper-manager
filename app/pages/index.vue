<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { useToast } from '~/components/ui/toast/use-toast'

definePageMeta({
  auth: {
    only: 'guest',
    redirectUserTo: '/gallery'
  }
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
  const { data, error } = await auth.signIn.email({
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
    window.localStorage.setItem('bearer_token', data?.session.id)
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
            <FormItem v-auto-animate>
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
            <FormItem v-auto-animate>
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
            type="submit"
            :disabled="loading"
          >
            <Icon
              v-if="loading"
              name="radix-icons:reload"
              class="animate-spin"
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
            orientation="horizontal"
            label="Or"
            class="my-6"
          />
          <Button
            type="button"
            variant="secondary"
            @click="auth.signIn.social({ provider: 'github', callbackURL: '/gallery' })"
          >
            <Icon name="radix-icons:github-logo" />
            Sign In with Github
          </Button>
        </DevOnly>
      </CardContent>
    </Card>
  </div>
</template>
