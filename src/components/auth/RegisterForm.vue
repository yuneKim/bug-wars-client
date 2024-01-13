<script setup lang="ts">
import { authService } from '@/services/authService';
import { type RegisterDto } from '@/types';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

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
    <form class="register-form" @input="authError = ''" @submit.prevent="handleSubmit">
      <h1 class="register-header">Register</h1>
      <label for="username">Username</label>
      <InputText
        type="text"
        name="username"
        id="username"
        v-model="formData.username"
        required
      />
      <label for="password">Password</label>
      <InputText
        type="password"
        name="password"
        id="password"
        v-model="formData.password"
        required
      />
      <label for="confirm-password">Confirm Password</label>
      <InputText
        type="password"
        name="confirm-password"
        id="confirm-password"
        v-model="formData.confirmPassword"
        required
      />
      <label for="email">Email</label>
      <InputText
        type="email"
        name="email"
        id="email"
        v-model="formData.email"
        required
      />
      <p class="error-message">{{ authError }}</p>
      <Button type="submit">Register</Button>
      <div>
        <p>Have an account?</p>
        <RouterLink :to="{ name: 'login' }">Login here!</RouterLink>
      </div>
    </form>
  </div>
</template>

<style scoped>
.register-header {
  text-align: center;
  color: #fff;
}
.register-form-container {
  margin: 0 auto;
  margin-top: 50px;
  max-width: 250px;
  text-transform: uppercase;
  border: .5px solid white;
  background-color: rgba(18, 18, 18, .85);
  border-radius: 2px;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  color: #fff;
}

.register-form a {
  color: #fff;
}

.register-form a:hover {
  color: #ff0000;
  transition: ease-in-out .2s;
}

.error-message {
  color: red;
}
</style>
