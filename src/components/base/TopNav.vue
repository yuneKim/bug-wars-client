<script setup lang='ts'>
import { storeToRefs } from 'pinia';
import { RouterLink, RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const { user } = storeToRefs(useAuthStore());
const { logout } = useAuthStore();
</script>

<template>
    <header>
        <nav class="header-div">
            <div class="nav-logo">
                <RouterLink :to="{ name: 'home' }" class="main-title-link">
                    <h1 class="main-title">Bug Wars</h1>
                </RouterLink>
            </div>

            <div class="nav-links">
                <RouterLink :to="{ name: 'home' }" class="home-link">Home</RouterLink>
                <RouterLink :to="{ name: 'gameLobby' }">Play</RouterLink>
                <RouterLink :to="{ name: 'scripts' }">Scripts</RouterLink>
                <a class="logout" href="" v-if="user.username" @click.prevent="logout(false)">Logout</a>
                <RouterLink class="login" v-else :to="{ name: 'login' }">Login</RouterLink>
            </div>
        </nav>
    </header>
</template>

<style scoped>
.header-div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 30px;
  background-image: url('@/assets/nav/bloody-nav.jpg');
  background-position: center;
}

.main-title-link {
  text-decoration: none;
  color: black;
}

.main-title {
  margin: 0;
  font-size: 1.7rem;
}

nav {
  width: 100%;
  font-size: 1rem;
  text-align: center;
  display: flex;
}

.nav-logo {
    flex-basis: content;
}

nav a {
  padding: 0 1rem;
  text-decoration: none;
  color: #000;
  text-transform: uppercase;
}

nav a:hover {
    color: #960000;
    transition: ease-in-out .3s;
}

.nav-links {
    font-size: 1.1rem;
}

</style>