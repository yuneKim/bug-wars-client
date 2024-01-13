<script setup lang="ts">
import TopNav from "@/components/base/TopNav.vue";

</script>

<template>
  <div class="container">
    <TopNav />

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

.main-title-link {
  text-decoration: none;
  color: black;
}

.home-link {
  margin-right: 40px;
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
  padding: 10px;
  background-color: rgba(18, 18, 18, .85);
  
}

.footer-nav a {
  padding: 0 1rem;
  text-decoration: none;
  color: #d1d1d1;
  text-transform: uppercase;
}

.footer-nav a:hover {
  color: rgb(255, 34, 0);
  transition: ease-in-out .3s;
}
</style>
