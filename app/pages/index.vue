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

const loading = ref(false)
const auth = useAuth()
const formSchema = toTypedSchema(z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(6).max(50)
}))
const form = useForm({
  validationSchema: formSchema
})
const { toast } = useToast()

const onSubmit = form.handleSubmit(async (values) => {
  if (loading.value)
    return
  loading.value = true
  const { error } = await auth.signIn.email({
    email: values.username,
    password: values.password
  })
  if (error) {
    console.error(error)
    toast({
      title: 'Login failed',
      variant: 'destructive'
    })
  }
  else {
    await navigateTo('/gallery')
  }
  loading.value = false
})
</script>

<template>
  <div class="flex justify-center">
    <Tabs default-value="email" class="w-[400px]">
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger value="email">
          Email
        </TabsTrigger>
        <TabsTrigger value="github">
          GitHub
        </TabsTrigger>
      </TabsList>
      <TabsContent value="email">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form class="space-y-6" @submit="onSubmit">
              <FormField v-slot="{ componentField }" name="username">
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input type="text" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="password">
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <Button type="submit" :disabled="loading">
                <Icon v-if="loading" name="radix-icons:reload" class="w-4 h-4 mr-2 animate-spin" />
                <template v-if="loading">
                  Logging in...
                </template>
                <template v-else>
                  Login
                </template>
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="github">
        <Card>
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
      </TabsContent>
    </Tabs>
  </div>
</template>
