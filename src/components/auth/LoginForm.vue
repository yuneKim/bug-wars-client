<script setup lang="ts">
import type { LoginDto } from '@/types';
import { ref } from 'vue';

const loginDto = ref<LoginDto>({
  username: '',
  password: '',
});

function submit() {
  console.log(loginDto.value);
}
</script>

<template>
  <div class="login-wrapper">
    <form class="login-form" @submit.prevent="submit">
      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" id="username" v-model="loginDto.username" />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="loginDto.password" />
      </div>
      <div class="form-group">
        <button type="submit">Login</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.login-wrapper {
  margin: 0 auto;
  max-width: 250px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}
</style>
