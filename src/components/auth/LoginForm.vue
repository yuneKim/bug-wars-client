<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import type { LoginDto } from '@/types';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

const { login, clearAuthError } = useAuthStore();
const { authError } = storeToRefs(useAuthStore());

const loginDto = ref<LoginDto>({
  username: 'test_user',
  password: 'sausages',
});
const loginError = ref('');
const displayError = computed(() => authError.value || loginError.value);

function submit() {
  if (!validateFormData()) return;

  login(loginDto.value);
}

function validateFormData() {
  let validated = true;
  if (loginDto.value.username.length === 0) {
    loginError.value = 'Username may not be blank.';
    validated = false;
  } else if (loginDto.value.password.length === 0) {
    loginError.value = 'Password may not be blank.';
    validated = false;
  }
  return validated;
}

function clearError() {
  loginError.value = '';
  clearAuthError();
}
</script>

<template>
  <div class="login-wrapper">
    <form class="login-form" @submit.prevent="submit">
      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" id="username" @input="clearError" v-model="loginDto.username" />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" @input="clearError" v-model="loginDto.password" />
      </div>
      <div class="form-group">
        <p v-if="displayError.length > 0" class="login-error">{{ displayError }}</p>
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

.login-error {
  color: red;
}
</style>
