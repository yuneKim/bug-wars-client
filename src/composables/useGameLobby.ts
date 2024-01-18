import { gameService } from '@/services/gameService';
import { scriptService } from '@/services/scriptService';
import type { ScriptName } from '@/types';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

export type Map = {
  id: number;
  name: string;
  swarms: number;
  previewImgUrl: string;
};

export async function useGameLobby() {
  const router = useRouter();

  const fourSwarmMapSelected = ref(false);
  const maps = ref<Map[]>([]);
  const scripts = ref<ScriptName[]>([]);
  const currentMap = ref<number>(0);
  const gameData = ref({
    map: 1,
    swarms: [1, 1, 1, 1],
  });

  const twoSwarmMaps = computed(() => maps.value.filter((map) => map.swarms === 2));
  const fourSwarmMaps = computed(() => maps.value.filter((map) => map.swarms === 4));
  const currentMapName = computed(() => {
    const maps = fourSwarmMapSelected.value ? fourSwarmMaps.value : twoSwarmMaps.value;
    return maps[currentMap.value]?.name;
  });
  const carouselValue = computed(() =>
    fourSwarmMapSelected.value ? fourSwarmMaps.value : twoSwarmMaps.value,
  );

  await loadMaps();
  await loadScripts();

  function startGame() {
    router.push({
      name: 'game',
      query: {
        m: gameData.value.map,
        s: gameData.value.swarms.slice(0, fourSwarmMapSelected.value ? 4 : 2).join(','),
      },
    });
  }

  async function loadMaps() {
    const response = await gameService.getMaps();

    if (response.type === 'success') {
      maps.value = response.data;
      setMap(0);
    } else {
      console.error(response.error);
    }
  }

  async function loadScripts() {
    const response = await scriptService.getAllNamesOfValidScripts();

    if (response.type === 'success') {
      scripts.value = response.data;
      gameData.value.swarms = gameData.value.swarms.map(
        (swarm, n) => response.data[n]?.id ?? swarm,
      );
    } else {
      console.error(response.error);
    }
  }

  function handleSelector() {
    setMap(0);
  }

  function setMap(page: number) {
    currentMap.value = page;
    const maps = fourSwarmMapSelected.value ? fourSwarmMaps.value : twoSwarmMaps.value;
    gameData.value.map = maps[page].id;
  }

  return {
    maps,
    scripts,
    gameData,
    currentMapName,
    currentMap,
    fourSwarmMapSelected,
    handleSelector,
    carouselValue,
    setMap,
    startGame,
  };
}
