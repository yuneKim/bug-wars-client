<script setup lang="ts">
import { useGameLobby } from '@/composables/useGameLobby';
import Button from 'primevue/button';
import Carousel from 'primevue/carousel';
import Dropdown from 'primevue/dropdown';
import InputSwitch from 'primevue/inputswitch';

const {
  scripts,
  gameData,
  currentMap,
  currentMapName,
  fourSwarmMapSelected,
  handleSelector,
  carouselValue,
  setMap,
  startGame,
} = await useGameLobby();

console.log(scripts);
</script>

<template>
  <div class="game-lobby-container">
    <div class="game-lobby-card">
      <div class="header-wrapper"></div>
      <h1 class="header">GAME LOBBY</h1>
      <div class="map-name-wrapper">
        <h3 class="map-name">{{ currentMapName }}</h3>
        <div class="sams-idea">
          <div :class="{ dimmed: fourSwarmMapSelected }">
            <img src="@/assets/img/bug-red.png" alt="sam" width="20px" height="20px" />
            <img src="@/assets/img/bug-blue.png" alt="sam" width="20px" height="20px" />
          </div>
          <InputSwitch v-model="fourSwarmMapSelected" @input="handleSelector" />
          <div :class="{ dimmed: !fourSwarmMapSelected }">
            <img src="@/assets/img/bug-red.png" alt="sam" width="20px" height="20px" />
            <img src="@/assets/img/bug-blue.png" alt="sam" width="20px" height="20px" />
            <img src="@/assets/img/bug-green.png" alt="sam" width="20px" height="20px" />
            <img src="@/assets/img/bug-purple.png" alt="sam" width="20px" height="20px" />
          </div>
        </div>
      </div>
      <div class="map-preview-wrapper">
        <Carousel
          class="map-carousel"
          :num-visible="1"
          :num-scroll="1"
          :page="currentMap"
          :value="carouselValue"
          @update:page="setMap"
        >
          <template #item="slotProps">
            <div class="map-preview">
              <img :src="slotProps.data.previewImgUrl" width="100%" alt="map preview" />
            </div>
          </template>
        </Carousel>
      </div>
      <div class="swarm-selection-wrapper">
        <div
          v-for="n in 4"
          :key="n"
          :class="{ 'swarm-group': true, 'disabled-swarm-group': n > 2 && !fourSwarmMapSelected }"
        >
          <label :for="`swarm${n}`">{{ `SWARM ${n}:` }}</label>
          <Dropdown
            :id="`swarm${n}`"
            :options="scripts"
            optionLabel="name"
            optionValue="id"
            v-model="gameData.swarms[n - 1]"
            :disabled="n > 2 && !fourSwarmMapSelected"
            data-test="swarm-select"
          >
            <template #value="slotProps">
              <div v-if="scripts.some((script) => script.id === slotProps.value)">
                <div>{{ scripts.find((script) => script.id === slotProps.value)?.name }}</div>
                <div class="script-author">
                  {{ scripts.find((script) => script.id === slotProps.value)?.author }}
                </div>
              </div>
              <div v-else>SELECT A SCRIPT</div>
            </template>
            <template #option="slotProps">
              <div>{{ slotProps.option.name }}</div>
              <div class="script-author">
                {{ slotProps.option.author }}
              </div>
            </template>
          </Dropdown>
        </div>
      </div>
      <div class="btn-wrapper">
        <Button class="start-game-btn" data-test="start-game" @click="startGame">Start Game</Button>
      </div>
    </div>
    <div class="preload-images">
      <img src="@/assets/img/bug-red.png" alt="red bug" />
      <img src="@/assets/img/bug-blue.png" alt="blue bug" />
      <img src="@/assets/img/bug-green.png" alt="green bug" />
      <img src="@/assets/img/bug-purple.png" alt="purple bug" />
      <img src="@/assets/img/wall.jpg" alt="wall" />
      <img src="@/assets/img/food.png" alt="food" />
      <img src="@/assets/img/blackstone-optimized.jpg" alt="replay viewer background" />
    </div>
  </div>
</template>

<style scoped>
.map-name-wrapper {
  margin: 0 auto;
  display: flex;
  max-width: 400px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.map-name {
  margin: 0;
  text-transform: uppercase;
}

.sams-idea {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
}

.sams-idea > div:not(.p-inputswitch) {
  display: flex;
  align-items: center;
  position: relative;
  padding: 4px;
}

.sams-idea img {
  filter: brightness(0.9);
}

.dimmed img {
  filter: brightness(0.4);
}

.game-lobby-container {
  display: flex;
  justify-content: center;
}

.game-lobby-card {
  margin-top: 50px;
  background-color: rgba(18, 18, 18, 0.85);
  color: #fff;
  padding: 50px;
  border: 0.5px solid white;
  border-radius: 2px;
  margin-inline: 10px;
}

.header {
  margin-block: 0 20px;
  text-align: center;
}

.max-swarm-select {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.map-preview-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.map-carousel {
  max-width: 500px;
  width: 100%;
}

:deep(.p-carousel-item) {
  display: flex;
  justify-content: center;
}

.map-preview {
  max-width: 400px;
  max-height: 400px;
  width: auto;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
}

.map-preview img {
  display: block;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
}

.script-author {
  font-size: 0.8rem;
}

.swarm-selection-wrapper {
  margin: 0 auto;
  margin-top: 20px;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.swarm-group {
  display: flex;
  flex-direction: column;
}

.btn-wrapper {
  margin-top: 30px;
  text-align: center;
}

.disabled-swarm-group {
  filter: brightness(60%);
}

.preload-images {
  display: none;
}

@media screen and (max-width: 600px) {
  .game-lobby-card {
    padding-inline: 10px;
    margin-block: 50px;
  }

  .map-name-wrapper {
    flex-direction: column-reverse;
    gap: 20px;
  }
}
</style>
