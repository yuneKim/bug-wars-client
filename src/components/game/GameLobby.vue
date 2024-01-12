<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export type GameData = {
  map: string;
  swarms: number[];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emit = defineEmits<{
  startGame: [gameData: GameData];
}>();

const router = useRouter();

const gameData = ref({
  map: 'ns_fortress4.txt',
  swarms: [1, 1, 1, 1],
});

function setSelect(e: Event, n: number) {
  const target = e.target as HTMLSelectElement;
  gameData.value.swarms[n - 1] = Number(target.value);
}

function startGame() {
  router.push({
    name: 'game',
    query: {
      m: gameData.value.map,
      s: gameData.value.swarms.join(','),
    },
  });
}
</script>

<template>
  <div class="game-lobby-container">
    <div>
      <h1 class="header">Game Lobby</h1>
      <div class="map-preview-wrapper">
        <button type="button" disabled>{{ '<' }}</button>
        <div class="map-preview">Fortress4</div>
        <button type="button" disabled>{{ '>' }}</button>
      </div>
      <div class="swarm-selection-wrapper">
        <div v-for="n in 4" :key="n" class="swarm-group">
          <label :for="`swarm${n}`">{{ `Swarm ${n}:` }}</label>
          <select :id="`swarm${n}`" @input="setSelect($event, n)">
            <option value="1">Pizza Rizza</option>
            <option value="2">Strawberry Sizzle</option>
          </select>
        </div>
      </div>
      <div class="btn-wrapper">
        <button class="start-game-btn" @click="startGame">Start Game</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-lobby-container {
  display: flex;
  justify-content: center;
}

.header {
  text-align: center;
}

.map-preview-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.map-preview {
  width: 300px;
  height: 300px;
  background-color: #ccc;
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
</style>
