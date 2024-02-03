import { gameService } from '@/services/gameService';
import {
  generateFrame,
  unsquashBattleground,
  type BattleGrid,
  type TickSummary,
} from '@/utils/replayUnsquasher';
import { cloneDeep } from 'lodash-es';
import { computed, ref, watch } from 'vue';
import type { LocationQuery } from 'vue-router';

type Swarm = {
  name: string;
  author: string;
  bytecode: number[];
};

type SwarmScore = {
  name: string;
  author: string;
  scores: number[];
};

export async function useReplayViewer(routeQuery: LocationQuery) {
  const frames = ref<BattleGrid[]>([]);
  const frameIndex = ref(0);
  const timer = ref<number | null>(null);
  const scoreboard = ref<SwarmScore[]>([]);
  await getReplay(Number(routeQuery.m), (routeQuery.s as string).split(',').map(Number));

  const showPause = computed(() => {
    return timer.value != null;
  });

  const topBugs = computed(() => {
    return scoreboard.value
      .map((swarm, n) => {
        return [n, swarm.scores[frameIndex.value] ?? 0];
      })
      .sort((a, b) => b[1] - a[1])
      .map((a) => a[0]);
  });

  watch(
    () => routeQuery,
    () => {
      getReplay(Number(routeQuery.m), (routeQuery.s as string).split(',').map(Number));
    },
  );

  async function getReplay(mapId: number, scriptIds: number[]) {
    const gameDto = {
      scriptIds,
      mapId,
    };
    const response = await gameService.getReplay(gameDto);

    if (response.type === 'success') {
      const { battleground, replay, swarms } = response.data;
      initializeScoreboard(swarms);
      unpackReplay(battleground, replay);
    } else {
      console.error('uh oh', response.status, response.error);
    }
  }

  function unpackReplay(battleground: string, ticks: TickSummary[] = []) {
    const initialState = unsquashBattleground(battleground);
    frames.value.push(initialState);
    updateScoreboard(initialState);
    for (let i = 0; i < ticks.length; i++) {
      const prevFrame = frames.value[i];
      const nextFrame = generateFrame(cloneDeep(prevFrame), ticks, i);
      frames.value.push(nextFrame);
      updateScoreboard(nextFrame);
    }
  }

  function initializeScoreboard(swarms: Swarm[]) {
    for (let i = 0; i < swarms.length; i++) {
      scoreboard.value[i] = {
        name: swarms[i].name,
        author: swarms[i].author,
        scores: [],
      };
    }
  }

  function updateScoreboard(frame: BattleGrid) {
    const bugsAlive: Record<number, number> = {};
    for (let i = 0; i < frame.length; i++) {
      for (let j = 0; j < frame[i].length; j++) {
        const entity = frame[i][j];
        if (entity.type === 'bug') {
          if (bugsAlive[entity.swarm] === undefined) bugsAlive[entity.swarm] = 0;
          bugsAlive[entity.swarm]++;
        }
      }
    }
    for (const swarm in bugsAlive) {
      scoreboard.value[swarm].scores.push(bugsAlive[swarm]);
    }
  }

  function play(n: number) {
    clearTimer();
    timer.value = setIntervalImmediately(() => {
      if (frameIndex.value < frames.value.length - 1) frameIndex.value++;
      if (frameIndex.value >= frames.value.length - 1) {
        clearTimer();
      }
    }, n);
  }

  function rewind() {
    pause();
    frameIndex.value = 0;
  }

  function pause() {
    clearTimer();
  }

  function prevFrame() {
    pause();
    if (frameIndex.value > 0) frameIndex.value--;
  }

  function nextFrame() {
    pause();
    if (frameIndex.value < frames.value.length - 1) frameIndex.value++;
  }

  function setIntervalImmediately(func: Function, interval: number) {
    func();
    return window.setInterval(func, interval);
  }

  function clearTimer() {
    if (timer.value) {
      clearInterval(timer.value);
      timer.value = null;
    }
  }

  return {
    frames,
    frameIndex,
    rewind,
    play,
    pause,
    showPause,
    prevFrame,
    nextFrame,
    scoreboard,
    topBugs,
  };
}
