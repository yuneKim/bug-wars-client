<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import type { LoginDto } from '@/types';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import { computed, ref } from 'vue';

const { login, clearAuthError } = useAuthStore();
const { authError } = storeToRefs(useAuthStore());

const loginDto = ref<LoginDto>({
  username: '',
  password: '',
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
  <div class="login-wrapper-wrapper">
    <div class="login-wrapper">
      <form class="login-form" @submit.prevent="submit">
        <h1 class="login-header">Login</h1>
        <div class="form-group">
          <label for="username">Username</label>
          <InputText
            size="small"
            type="text"
            id="username"
            @input="clearError"
            v-model="loginDto.username"
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <Password
            v-model="loginDto.password"
            toggleMask
            size="small"
            type="password"
            id="password"
            class="password-input"
            :feedback="false"
            @input="clearError"
          />
        </div>
        <div class="form-group">
          <p v-if="displayError.length > 0" class="login-error">{{ displayError }}</p>
          <Button class="submit-btn" type="submit">Login</Button>
        </div>
        <Divider class="divider" />
        <div>
          <p>Don't have an account?</p>
          <RouterLink :to="{ name: 'register' }">Register here!</RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-wrapper-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
  padding-block: 150px;
}

.login-wrapper {
  margin: 0 auto;
  margin-block: auto;
  width: 100%;
  max-width: 400px;
  text-transform: uppercase;
  border: 0.5px solid white;
  border-radius: 2px;
  position: relative;
  top: -100px;
  margin-inline: 10px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  background-color: rgba(18, 18, 18, 0.85);
  padding: 50px;
  color: #fff;
}

.login-form a {
  color: #fff;
}

.login-form a:hover {
  color: rgb(255, 34, 0);
  transition: ease-in-out 0.2s;
}

.login-header {
  text-align: center;
  color: #fff;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.login-error {
  color: red;
}

.submit-btn {
  padding-top: 6px;
}

.divider {
  margin-top: 15px;
  margin-bottom: 0px;
}

.password-input,
.password-input :deep(input) {
  width: 100%;
}
</style>
