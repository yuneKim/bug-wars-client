<script setup lang="ts">
import { authService } from '@/services/authService';
import { type RegisterDto } from '@/types';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const authError = ref('');

type FormData = {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
};

const formData = ref<FormData>({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
});

function handleSubmit() {
  if (formData.value.username.length < 3) {
    authError.value = 'Username must be at least 3 characters long.';
    return;
  }
  if (formData.value.password.length < 6) {
    authError.value = 'Password must be at least 6 characters long.';
    return;
  }
  if (formData.value.password !== formData.value.confirmPassword) {
    authError.value = 'Passwords do not match.';
    return;
  }
  register({
    username: formData.value.username,
    password: formData.value.password,
    email: formData.value.email,
  });
}

async function register(registerDto: RegisterDto) {
  const response = await authService.register(registerDto);

  if (response.type === 'success') {
    router.push({ name: 'login' });
  } else {
    authError.value = response.error;
  }
}
</script>
<template>
  <div class="register-form-container">
    <h1 class="register-header">Register</h1>
    <form class="register-form" @input="authError = ''" @submit.prevent="handleSubmit">
      <input
        type="text"
        name="username"
        id="username"
        placeholder="username"
        v-model="formData.username"
        required
      />
      <input
        type="password"
        name="password"
        id="password"
        placeholder="password"
        v-model="formData.password"
        required
      />
      <input
        type="password"
        name="confirm-password"
        id="confirm-password"
        placeholder="confirm password"
        v-model="formData.confirmPassword"
        required
      />
      <input
        type="email"
        name="email"
        id="email"
        placeholder="email"
        v-model="formData.email"
        required
      />
      <p class="error-message">{{ authError }}</p>
      <button type="submit">Register</button>
      <div>
        <p>Already have an account?</p>
        <RouterLink :to="{ name: 'login' }">Login here!</RouterLink>
      </div>
    </form>
  </div>
</template>

<style scoped>
.register-header {
  text-align: center;
}
.register-form-container {
  display: block;
  margin: 0 auto;
  width: 300px;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.error-message {
  color: red;
}
</style>
