<script setup lang="ts">
import Button from 'primevue/button';
import { ref } from 'vue';

const logoLoaded = ref(false);
</script>

<template>
  <div class="landing-container">
    <div class="slightly-smaller-container">
      <div class="logo-wrapper">
        <Transition name="logo">
          <img
            v-show="logoLoaded"
            class="logo"
            src="@/assets/base/logo.png"
            @load="logoLoaded = true"
          />
        </Transition>
      </div>

      <div class="btn-wrapper">
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
  </div>
</template>

<style scoped>
.landing-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slightly-smaller-container {
  margin-top: -150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.logo-wrapper {
  height: 370px;
}

.logo {
  width: 300px;
  position: relative;
  left: 7px;
}

.btn-wrapper {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.btn-wrapper a {
  text-decoration: none;
  color: white;
  position: relative;
  top: 1px;
}

.logo-enter-from {
  transform: translateY(-100%);
}

.logo-enter-active {
  transition: transform 0.5s;
}

.logo-enter-to {
  transform: translateY(0);
}
</style>
