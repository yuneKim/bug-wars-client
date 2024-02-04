<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const { user } = storeToRefs(useAuthStore());
const { logout } = useAuthStore();

let hamburgerIsVisible = ref(true);

const showNavLinks = () => {
  hamburgerIsVisible.value = false;
};

const hideNavLinks = () => {
  hamburgerIsVisible.value = true;
};
</script>

<template>
  <header>
    <nav class="header-div">
      <div class="nav-logo">
        <RouterLink :to="{ name: 'home' }" class="main-title-link">
          <h1 class="main-title">Bug Wars</h1>
        </RouterLink>
      </div>

      <div
        class="nav-links"
        :style="{ left: hamburgerIsVisible ? '-100%' : '0' }"
        data-test="nav-links"
      >
        <RouterLink @click="hideNavLinks" :to="{ name: 'home' }" class="home-link">Home</RouterLink>
        <RouterLink @click="hideNavLinks" :to="{ name: 'gameLobby' }">Play</RouterLink>
        <RouterLink @click="hideNavLinks" :to="{ name: 'scripts' }">Scripts</RouterLink>
        <RouterLink @click="hideNavLinks" class="extra-mobile-link" :to="{ name: 'howToPlay' }"
          >How to Play</RouterLink
        >
        <RouterLink @click="hideNavLinks" class="extra-mobile-link" :to="{ name: 'credits' }"
          >Credits</RouterLink
        >
        <RouterLink @click="hideNavLinks" class="extra-mobile-link" :to="{ name: 'demo' }"
          >Demo</RouterLink
        >
        <a class="logout" href="" v-if="user.username" @click.prevent="logout(true), hideNavLinks()"
          >Logout</a
        >
        <RouterLink @click="hideNavLinks" class="login" v-else :to="{ name: 'login' }"
          >Login</RouterLink
        >
      </div>

      <span class="nav-btn">
        <Button
          class="hamburger-btn"
          v-if="hamburgerIsVisible"
          @click="showNavLinks"
          data-test="hamburger-button"
          icon="pi pi-bars"
          style="background-color: black"
        />
        <Button
          class="x-btn"
          v-if="!hamburgerIsVisible"
          @click="hideNavLinks"
          data-test="x-button"
          icon="pi pi-times"
          style="background-color: black"
        />
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

.nav-btn {
  display: none;
}

.extra-mobile-link {
  display: none;
}

@media (max-width: 768px) {
  .extra-mobile-link {
    display: inline;
  }

  .nav-links {
    position: fixed;
    top: 64px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background-color: rgba(18, 18, 18, 0.85);
    z-index: 10;
    width: 100%;
  }

  .nav-links a {
    padding: 10px;
  }

  .nav-btn {
    display: inline-block;
    margin-right: 10px;
  }
}
</style>
