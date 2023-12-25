<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink :to="{ name: 'login' }">Login</RouterLink>
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
