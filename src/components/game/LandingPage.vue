<script setup lang="ts">
import Button from 'primevue/button';
</script>

<template>
  <div class="container">
    <div class="btn-wrapper">
      <!-- logo goes here -->
      <Button data-test="gameLobby">
        <RouterLink :to="{ name: 'gameLobby' }">Play Game</RouterLink>
      </Button>
      <Button data-test="scriptEditor">
        <RouterLink :to="{ name: 'scripts' }">Script Editor</RouterLink>
      </Button>
      <Button data-test="howToPlay">
        <RouterLink :to="{ name: 'howToPlay' }">How to Play</RouterLink>
      </Button>
      <Button data-test="credits">
        <RouterLink :to="{ name: 'credits' }">Credits</RouterLink>
      </Button>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  padding-top: calc(100vh / 4);
}

.btn-wrapper {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.btn-wrapper a {
  text-decoration: none;
  color: white;
}
</style>
