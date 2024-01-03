<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { RouterLink, RouterView } from 'vue-router';
import { useAuthStore } from './stores/auth';

const { user } = storeToRefs(useAuthStore());
const { logout } = useAuthStore();
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <a class="logout" href="" v-if="user.username" @click.prevent="logout(false)">Logout</a>
        <RouterLink class="login" v-else :to="{ name: 'login' }">Login</RouterLink>
        <RouterLink :to="{ name: 'register' }">Register</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  max-height: 100vh;
}

nav {
  width: 100%;
  font-size: 1rem;
  text-align: center;
  display: flex;
}

nav a {
  padding: 0 1rem;
}
</style>
