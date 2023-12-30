<script setup lang="ts">
import { ref } from 'vue';
import { authService } from '@/services/authService'
import { useRouter } from 'vue-router';
import axios from 'axios';
import { type RegisterDto } from '@/types'


const router = useRouter();
const authError = ref('');

type FormData = {
    username: string,
    password: string,
    confirmPassword: string,
    email: string
};

const formData = ref <FormData>({
    username: '',
    password: '',
    confirmPassword: '',
    email: ''
})


function handleSubmit(){
    console.log("worked")
    if(formData.value.username.length < 3){
        authError.value = "Username must be at least 3 characters long";
        return;
    };
    if(formData.value.password.length < 6){
        authError.value = "Password must be at least 6 characters long";
        return;
    };
    if(formData.value.password !== formData.value.confirmPassword) {
        authError.value = "Passwords do not match";
        return;
    };
    console.log("validated")
    register({
        username: formData.value.username,
        password: formData.value.password,
        email: formData.value.email
    })
}


async function register(registerDto: RegisterDto) {
    let response;
    try {
      response = await authService.register(registerDto);
      if (response.status === 201) {
        router.push({ name: 'login' });
      }
    } catch (error) {
      if (!(error instanceof Error)) return;
      handleRegisterError(error);
    }
  }

  function handleRegisterError(error: Error) {
    if (!axios.isAxiosError(error)) {
      console.error('Non-axios error:', error);
      return;
    }

    if (error.response?.status === 400) {
      authError.value = 'Username and Password cannot be blank.';
    } else if (error.response?.status === 401) {
      authError.value = 'Your login attempt failed. Please try again.';
    } else if (error.response?.status === 409) {
      authError.value = error.response.data.message;
    } else {
      authError.value = 'Something went wrong on our end. Try again later.';
    }
  }

</script>
<template>
    <div class="register-form-container">
        <h1 class="register-header">Register</h1>
        <form class="register-form" @input="authError=''" @submit.prevent="handleSubmit">
            <input type="text" name="username" id="username" placeholder="username" v-model="formData.username" required>
            <input type="password" name="password" id="password" placeholder="password" v-model="formData.password" required>
            <input type="password" name="confirm-password" id="confirm-password" placeholder="confirm password" v-model="formData.confirmPassword" required>
            <input type="email" name="email" id="email" placeholder="email" v-model="formData.email" required>
            <p class="error-message">{{authError}}</p>
            <button type="submit">Register</button>
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