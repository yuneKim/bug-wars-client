<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { RouterLink, RouterView } from 'vue-router';
import { useAuthStore } from './stores/auth';

const { user } = storeToRefs(useAuthStore());
const { logout } = useAuthStore();
</script>

<template>
  <div class="container">
    <header>
      <nav class="header-div">
        <div class="left">
          <RouterLink :to="{ name: 'gameLobby' }">Play Game</RouterLink>
          <RouterLink :to="{ name: 'scriptEditor' }">Script Editor</RouterLink>
        </div>
        <div class="middle"><h1 class="main-title">Bug Wars</h1></div>
        <div class="right">
          <RouterLink to="/">Home</RouterLink>
          <a class="logout" href="" v-if="user.username" @click.prevent="logout(false)">Logout</a>
          <RouterLink class="login" v-else :to="{ name: 'login' }">Login</RouterLink>
          <RouterLink :to="{ name: 'register' }">Register</RouterLink>
        </div>
      </nav>
    </header>

    <RouterView />
    <footer>
      <nav class="footer-nav">
        <RouterLink :to="{ name: 'howToPlay' }">How to Play</RouterLink>
        <RouterLink :to="{ name: 'credits' }">Credits</RouterLink>
      </nav>
    </footer>
  </div>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-rows: auto 1fr auto;
  position: absolute;
  inset: 0;
}

.header-div {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
}

.left {
  justify-self: end;
  display: flex;
  align-items: center;
  margin-right: 75px;
}

.center {
  display: flex;
  align-items: center;
}

.right {
  justify-self: start;
  display: flex;
  align-items: center;
  margin-left: 75px;
}

.main-title {
  margin: 0;
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

.footer-nav {
  display: flex;
  justify-content: flex-end;
  padding-bottom: 5px;
}
</style>
