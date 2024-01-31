<script setup lang="ts">
import TopNav from '@/components/base/TopNav.vue';
</script>

<template>
  <div class="container">
    <TopNav />
    <div class="router-view-container">
      <RouterView />
    </div>
    <footer>
      <nav class="footer-nav">
        <RouterLink :to="{ name: 'demo' }">Demo</RouterLink>
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

.router-view-container {
  overflow-y: auto;
}

.footer-nav {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
  background-color: rgba(18, 18, 18, 0.85);
}

.footer-nav a {
  padding: 0 1rem;
  text-decoration: none;
  color: #d1d1d1;
  text-transform: uppercase;
}

.footer-nav a:hover {
  color: rgb(255, 34, 0);
  transition: ease-in-out 0.2s;
}

@media (max-width: 768px) {
  .footer-nav {
    display: none;
  }
}
</style>
