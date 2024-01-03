<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

const { user } = storeToRefs(useAuthStore());
</script>

<template>
  <main>{{ user.username ? `Welcome, ${user.username}!` : 'Please log in.' }}</main>
</template>

<style scoped>
main {
  padding-top: 50px;
  text-align: center;
}
</style>
