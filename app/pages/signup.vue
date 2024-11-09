<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { useToast } from '~/components/ui/toast/use-toast'

definePageMeta({
  auth: false
})

const router = useRouter()
const auth = useAuth()
const formSchema = toTypedSchema(z.object({
  email: z.string().min(2).max(50).email(),
  password: z.string().min(6).max(50),
  name: z.string().min(2).max(50)
}))
const form = useForm({
  validationSchema: formSchema
})
const { toast } = useToast()

const loading = ref(false)

// not open for signup
router.removeRoute('signup')

const onSignup = form.handleSubmit(async (values) => {
  if (loading.value)
    return
  loading.value = true
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
  loading.value = false
})
</script>

<template>
  <div class="flex justify-center">
    <Card class="w-[400px]">
      <CardHeader>
        <CardTitle>Signup</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="signup-form" class="space-y-6" @submit.prevent="onSignup">
          <FormField v-slot="{ componentField }" name="email">
            <FormItem v-auto-animate>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="password">
            <FormItem v-auto-animate>
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
          <Button id="signup-button" type="submit" :disabled="loading">
            <Icon v-if="loading" name="radix-icons:reload" class="animate-spin" />
            <template v-if="loading">
              Signing up...
            </template>
            <template v-else>
              Signup
            </template>
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
