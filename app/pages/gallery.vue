<script setup lang="ts">
const { user, session, client } = useAuth()
const toast = useToast()
const { data: accounts } = await useAsyncData('accounts', () => client.listAccounts())

function hasProvider(provider: string) {
  return accounts.value?.data?.some(account => account.providerId === provider)
}
const error = useRoute().query?.error
onMounted(() => {
  if (error) {
    toast.add({
      color: 'error',
      title: error.toString()
    })
  }
})
</script>

<template>
  <div class="h-dvh">
    <h3 class="text-xl font-bold">
      User
    </h3>
    <pre>{{ user }}</pre>
    <h3 class="text-xl font-bold mt-2">
      Session
    </h3>
    <pre>{{ session }}</pre>
    <h3 class="text-xl font-bold mt-2">
      Accounts
    </h3>
    <p class="mt-2">
      <UButton
        v-if="hasProvider('github')"
        color="secondary"
        icon="i-simple-icons-github"
        trailing-icon="i-heroicons-check"
      >
        Linked with GitHub
      </UButton>
      <UButton
        v-else
        color="secondary"
        icon="i-simple-icons-github"
        @click="client.linkSocial({ provider: 'github' })"
      >
        Link account with GitHub
      </UButton>
    </p>
  </div>
</template>
