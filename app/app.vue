<script setup lang="ts">
import Header from './components/Header.vue'
</script>

<template>
  <UApp>
    <Header />
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />
    <NuxtPage />
  </UApp>
</template>

<style>
@import './assets/app.css';
</style>
