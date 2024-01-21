<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { RouterLink } from 'vue-router';
import Button from 'primevue/button';
import { ref } from 'vue';


const { user } = storeToRefs(useAuthStore());
const { logout } = useAuthStore();
const isVisible = ref(false);
</script>

<template>
  <header>
    <nav class="header-div">
      <div class="nav-logo">
        <RouterLink :to="{ name: 'home' }" class="main-title-link">
          <h1 class="main-title">Bug Wars</h1>
        </RouterLink>
      </div>

      <div class="nav-links" v-if="isVisible === true">
        <RouterLink :to="{ name: 'home' }" class="home-link">Home</RouterLink>
        <RouterLink :to="{ name: 'gameLobby' }">Play</RouterLink>
        <RouterLink :to="{ name: 'scripts' }">Scripts</RouterLink>
        <RouterLink class="extra-mobile-link" :to="{ name: 'howToPlay' }">How to Play</RouterLink>
        <RouterLink class="extra-mobile-link" :to="{ name: 'credits' }">Credits</RouterLink>
        <a class="logout" href="" v-if="user.username" @click.prevent="logout(true)">Logout</a>
        <RouterLink class="login" v-else :to="{ name: 'login' }">Login</RouterLink>
        
      </div>

      <span class="hamburger-btn">
        <Button @click="isVisible = !isVisible" icon="pi pi-bars" style="background-color: black"/>
      </span>
    </nav>
  </header>
</template>

<style scoped>
.header-div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 30px;
  background-color: rgba(18, 18, 18, 0.85);
  height: 4rem;
  width: 100%;
  font-size: 1rem;
  text-align: center;
}

.main-title-link {
  text-decoration: none;
  color: black;
  position: relative;
}

.main-title {
  margin: 0;
  font-size: 1.7rem;
  color: white;
}

nav a {
  text-decoration: none;
  color: #000;
  text-transform: uppercase;
  position: relative;
  top: 1px;
  color: white;
}

nav a:hover {
  color: #ff0000;
  transition: ease-in-out 0.2s;
}

.nav-links {
  font-size: 1.1rem;
}

.nav-links a {
  padding: 0 1rem;
}

.hamburger-btn {
  display: none;
}



.extra-mobile-link {
  display: none;
}

@media(max-width:480px){
  /* .nav-links {
  position:fixed;
  left: -100%;
} */

.hamburger-btn {
  display: inline-block;
  margin-right: 10px; 
}



}
</style>
