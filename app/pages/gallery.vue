<script setup lang="ts">
</script>

<template>
  <div class="grid gap-4 grid-cols-7 grid-flow-row place-items-center justify-center m-4">
    <Card v-for="index in 50" :key="index" v-auto-animate class="w-48">
      <CardHeader>
        <CardTitle>Picture name</CardTitle>
      </CardHeader>
      <CardContent>
        Image
      </CardContent>
      <CardFooter />
    </Card>
  </div>
</template>
