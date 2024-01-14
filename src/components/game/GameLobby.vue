<script setup lang="ts">
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

export type GameData = {
  map: string;
  swarms: string[];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emit = defineEmits<{
  startGame: [gameData: GameData];
}>();

const router = useRouter();

const options = [
  { name: 'Pizza Rizza', value: '1' },
  { name: 'Strawberry Sizzle', value: '2' },
];

const gameData = ref({
  map: 'ns_fortress4.txt',
  swarms: ['1', '1', '1', '1'],
});

watch(gameData, (data) => {
  console.log(data);
});

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
    <div class="game-lobby-card">
      <h1 class="header">GAME LOBBY</h1>
      <div class="map-preview-wrapper">
        <Button type="button" icon="pi pi-arrow-left" disabled></Button>
        <div class="map-preview">Fortress4</div>
        <Button type="button" icon="pi pi-arrow-right" disabled></Button>
      </div>
      <div class="swarm-selection-wrapper">
        <div v-for="n in 4" :key="n" class="swarm-group">
          <label :for="`swarm${n}`">{{ `SWARM ${n}:` }}</label>
          <Dropdown
            :id="`swarm${n}`"
            :options="options"
            optionLabel="name"
            optionValue="value"
            v-model="gameData.swarms[n - 1]"
            data-test="swarm-select"
          >
          </Dropdown>
        </div>
      </div>
      <div class="btn-wrapper">
        <Button class="start-game-btn" data-test="start-game" @click="startGame">Start Game</Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
}

.header {
  margin-block: 0 20px;
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
  background-color: rgba(0, 0, 0, 0.6);
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
