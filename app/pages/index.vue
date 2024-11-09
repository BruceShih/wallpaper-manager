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

const loginLoading = ref(false)
const signupLoading = ref(false)
const auth = useAuth()
const loginFormSchema = toTypedSchema(z.object({
  email: z.string().min(2).max(50),
  password: z.string().min(6).max(50)
}))
const signupFormSchema = toTypedSchema(z.object({
  email: z.string().min(2).max(50),
  password: z.string().min(6).max(50),
  name: z.string().min(2).max(50)
}))
const loginForm = useForm({
  validationSchema: loginFormSchema
})
const signupForm = useForm({
  validationSchema: signupFormSchema
})
const { toast } = useToast()

const onLogin = loginForm.handleSubmit(async (values) => {
  if (loginLoading.value)
    return
  loginLoading.value = true
  const { error } = await auth.signIn.email({
    email: values.email,
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
  loginLoading.value = false
})

const onSignup = signupForm.handleSubmit(async (values) => {
  if (signupLoading.value)
    return
  signupLoading.value = true
  const { error } = await auth.signUp.email({
    email: values.email,
    password: values.password,
    name: values.name
  })
  if (error) {
    toast({
      title: 'Signup failed',
      variant: 'destructive'
    })
  }
  else {
    await navigateTo('/gallery')
    toast({
      title: 'Signup successful'
    })
  }
  signupLoading.value = false
})
</script>

<template>
  <div class="flex justify-center">
    <Tabs default-value="login" class="w-[400px]">
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger value="login">
          Login
        </TabsTrigger>
        <TabsTrigger value="signup">
          Signup
        </TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form class="space-y-6" @submit="onLogin">
              <FormField v-slot="{ componentField }" name="email">
                <FormItem>
                  <FormLabel>Email</FormLabel>
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
              <Button type="submit" :disabled="loginLoading">
                <Icon v-if="loginLoading" name="radix-icons:reload" class="w-4 h-4 mr-2 animate-spin" />
                <template v-if="loginLoading">
                  Logging in...
                </template>
                <template v-else>
                  Login
                </template>
              </Button>
              <Separator orientation="horizontal" label="Or" />
              <Button
                variant="secondary"
                @click="auth.signIn.social({ provider: 'github', callbackURL: '/gallery' })"
              >
                <Icon name="radix-icons:github-logo" />
                Sign In with Github
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="signup">
        <Card>
          <CardHeader>
            <CardTitle>Signup</CardTitle>
          </CardHeader>
          <CardContent>
            <form class="space-y-6" @submit="onSignup">
              <FormField v-slot="{ componentField }" name="email">
                <FormItem>
                  <FormLabel>Email</FormLabel>
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
              <FormField v-slot="{ componentField }" name="name">
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <Button type="submit" :disabled="signupLoading">
                <Icon v-if="signupLoading" name="radix-icons:reload" class="w-4 h-4 mr-2 animate-spin" />
                <template v-if="signupLoading">
                  Signing up...
                </template>
                <template v-else>
                  Signup
                </template>
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
      <!-- <TabsContent value="github">
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
      </TabsContent> -->
    </Tabs>
  </div>
</template>
