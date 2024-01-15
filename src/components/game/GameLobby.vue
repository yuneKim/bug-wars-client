<script setup lang="ts">
import { gameService } from '@/services/gameService';
import Button from 'primevue/button';
import Carousel from 'primevue/carousel';
import Dropdown from 'primevue/dropdown';
import InputSwitch from 'primevue/inputswitch';
import { onMounted, ref } from 'vue';
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

type Map = {
  id: number;
  name: string;
  swarms: number;
  previewImgUrl: string;
};

const fourSwarmMap = ref(false);
const maps = ref<Map[]>([]);

const options = [
  { name: 'Pizza Rizza', value: '1' },
  { name: 'Strawberry Sizzle', value: '2' },
];

const currentMap = ref<number>(0);

const gameData = ref({
  map: 'ns_faceoff.txt',
  swarms: ['1', '1'],
});

function startGame() {
  console.log('gameData', gameData.value);

  router.push({
    name: 'game',
    query: {
      m: gameData.value.map,
      s: gameData.value.swarms.join(','),
    },
  });
}

async function loadMaps() {
  const response = await gameService.getMaps();

  if (response.type === 'success') {
    maps.value = response.data;
    // gameData.value.map = maps.value[0].id;
    console.log(maps.value);
  } else {
    console.error(response.error);
  }
}

function setMap(page: number) {
  currentMap.value = page;
}

onMounted(loadMaps);
</script>

<template>
  <div class="game-lobby-container">
    <div class="game-lobby-card">
      <div class="header-wrapper"></div>
      <h1 class="header">GAME LOBBY</h1>
      <div class="map-name-wrapper">
        <h3 class="map-name">{{ maps[currentMap].name }}</h3>
        <div class="sams-idea">
          <div>
            <img src="@/assets/img/bug-red.png" alt="sam" width="20px" height="20px" />
            <img src="@/assets/img/bug-blue.png" alt="sam" width="20px" height="20px" />
          </div>
          <InputSwitch v-model="fourSwarmMap" />
          <div>
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
          :value="maps"
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

.sams-idea div {
  display: flex;
  align-items: center;
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
}

:deep(.p-carousel-item) {
  display: flex;
  justify-content: center;
}

.map-preview {
  max-width: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
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
