<script setup lang="ts">
import { authService } from '@/services/authService';
import { type RegisterDto } from '@/types';
import { RegExpMatcher, englishDataset, englishRecommendedTransformers } from 'obscenity';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

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
  if (matcher.hasMatch(formData.value.username)) {
    authError.value = 'The username created contains profanities.';
    return;
  }
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
  <div class="register-form-container-container">
    <div class="register-form-container">
      <form class="register-form" @input="authError = ''" @submit.prevent="handleSubmit">
        <h1 class="register-header">Register</h1>
        <div class="form-group">
          <label for="username">Username</label>
          <InputText
            type="text"
            name="username"
            id="username"
            v-model="formData.username"
            maxlength="30"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <Password
            toggleMask
            type="password"
            name="password"
            id="password"
            v-model="formData.password"
            class="password-input"
            required
          />
        </div>
        <div class="form-group">
          <label for="confirm-password">Confirm Password</label>
          <Password
            toggleMask
            type="password"
            name="confirm-password"
            id="confirm-password"
            v-model="formData.confirmPassword"
            class="password-input"
            required
            :feedback="false"
          />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <InputText type="email" name="email" id="email" v-model="formData.email" required />
        </div>
        <div class="form-group">
          <p v-if="authError.length > 0" class="error-message">{{ authError }}</p>
          <Button class="submit-btn" type="submit">Register</Button>
        </div>
        <Divider class="divider" />
        <div>
          <p>Already have an account?</p>
          <RouterLink :to="{ name: 'login' }">Login here!</RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
#password-note {
  margin: 0px;
}
.register-form-container-container {
  padding-block: 150px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.register-header {
  text-align: center;
  color: #fff;
}
.register-form-container {
  margin: 0 auto;
  margin-block: auto;
  margin-inline: 10px;
  width: 100%;
  max-width: 400px;
  text-transform: uppercase;
  border: 0.5px solid white;
  background-color: rgba(18, 18, 18, 0.85);
  border-radius: 2px;
  position: relative;
  top: -100px;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 50px;
  color: #fff;
}

.register-form a {
  color: #fff;
}

.register-form a:hover {
  color: #ff0000;
  transition: ease-in-out 0.2s;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.error-message {
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
