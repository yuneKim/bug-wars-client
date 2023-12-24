<script setup lang="ts">
import type { LoginDto } from '@/types';
import { ref } from 'vue';

const loginDto = ref<LoginDto>({
  username: '',
  password: '',
});
</script>

<template>
  <div class="login-wrapper">
    <form @submit.prevent="">
      <label for="username">Username</label>
      <input type="text" id="username" />
    </form>
  </div>
</template>

<style scoped>
.login-wrapper {
  margin: 0 auto;
  max-width: 1000px;
}
</style>
