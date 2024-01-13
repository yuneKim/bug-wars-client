<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import type { LoginDto } from '@/types';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';


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
  <div class="login-wrapper">
    <form class="login-form" @submit.prevent="submit">
      <div class="form-group">
        <label for="username">Username</label>
        <InputText size="small" type="text" id="username" @input="clearError" v-model="loginDto.username" />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <InputText size="small" type="password" id="password" @input="clearError" v-model="loginDto.password" />
      </div>
      <div class="form-group">
        <p v-if="displayError.length > 0" class="login-error">{{ displayError }}</p>
        <Button type="submit">Login</Button>
      </div>
      <div>
        <p>Don't have an account?</p>
        <RouterLink :to="{ name: 'register' }">Register here!</RouterLink>
      </div>
    </form>
  </div>
</template>

<style scoped>
.login-wrapper {
  margin: 0 auto;
  margin-top: 50px;
  max-width: 250px;
  text-transform: uppercase;
  border: .5px solid white;
  border-radius: 2px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  background-color: rgba(18, 18, 18, .85);
  padding: 20px;
  color: #fff;
}

.login-form a {
  color: #fff;
}

.login-form a:hover {
  color: rgb(255, 34, 0);
  transition: ease-in-out .2s;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.login-error {
  color: red;
}
</style>
