<script setup lang="ts">
import Button from 'primevue/button';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
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
        <RouterLink :to="{ name: 'gameLobby' }">
          <Button data-test="gameLobby" class="btn"> Play Game </Button>
        </RouterLink>
        <RouterLink :to="{ name: 'scripts' }">
          <Button data-test="scriptEditor" class="btn">Scripts</Button>
        </RouterLink>
        <RouterLink :to="{ name: 'howToPlay' }">
          <Button data-test="howToPlay" class="btn">How To Play</Button>
        </RouterLink>
        <RouterLink :to="{ name: 'credits' }">
          <Button data-test="credits" class="btn">Credits</Button>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.landing-container {
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-block: 150px;
}

.slightly-smaller-container {
  margin-block: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  position: relative;
  top: -100px;
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

.btn-wrapper .p-button {
  text-decoration: none;
  color: white;
  width: 100%;
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

@media screen and (max-width: 600px) {
  .landing-container {
    padding-block: 105px;
  }
  .logo-wrapper {
    max-height: 40dvh;
  }
  .logo {
    max-height: 40dvh;
    width: auto;
  }
  .btn-wrapper {
    width: 100%;
    gap: 25px;
    margin-bottom: 25px;
  }

  .btn {
    padding-block: 15px;
  }
}
</style>
