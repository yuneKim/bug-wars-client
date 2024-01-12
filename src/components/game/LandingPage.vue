<script setup lang="ts">
import Button from 'primevue/button';
</script>

<template>
  <div class="container">
    <div class="btn-wrapper">
      <!-- logo goes here -->
      <Button>
        <RouterLink :to="{ name: 'gameLobby' }" data-test="gameLobby">Play Game</RouterLink>
      </Button>
      <Button>
        <RouterLink :to="{ name: 'scripts' }" data-test="scriptEditor">Script Editor</RouterLink>
      </Button>
      <Button>
        <RouterLink :to="{ name: 'howToPlay' }" data-test="howToPlay">How to Play</RouterLink>
      </Button>
      <Button>
        <RouterLink :to="{ name: 'credits' }" data-test="credits">Credits</RouterLink>
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

.p-button {
  justify-content: center;
  background: red;
  border-radius: 0;
  border-color: red;
  padding-block: 5px;
}

.btn-wrapper a {
  text-decoration: none;
  color: white;
}
</style>
