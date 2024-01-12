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
  bytecode: number[];
};

type SwarmScore = {
  name: string;
  scores: number[];
};

export function useReplayViewer(routeQuery: LocationQuery) {
  const frames = ref<BattleGrid[]>([]);
  const frameIndex = ref(0);
  const timer = ref(0);
  const scoreBoard = ref<SwarmScore[]>([]);

  const showPause = computed(() => {
    return timer.value !== 0;
  });

  const topBugs = computed(() => {
    const scores = scoreBoard.value.map((swarm) => {
      return swarm.scores[frameIndex.value];
    });
    const topBugs: number[] = [];
    scores.forEach((score, i) => {
      if (score === Math.max(...scores)) {
        topBugs.push(i);
      }
    });
    return topBugs;
  });

  watch(
    () => routeQuery,
    () => {
      getReplay(routeQuery.m as string, (routeQuery.s as string).split(',').map(Number));
    },
    {
      immediate: true,
    },
  );

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
      scoreBoard.value[i] = {
        name: swarms[i].name,
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
      scoreBoard.value[swarm].scores.push(bugsAlive[swarm]);
    }
  }

  function play(n: number) {
    clearInterval(timer.value);
    timer.value = setIntervalImmediately(() => {
      if (frameIndex.value < frames.value.length - 1) frameIndex.value++;
      if (frameIndex.value >= frames.value.length - 1) {
        clearInterval(timer.value);
        timer.value = 0;
      }
    }, n);
  }

  function rewind() {
    pause();
    frameIndex.value = 0;
  }

  function pause() {
    clearInterval(timer.value);
    timer.value = 0;
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

  async function getReplay(mapName: string, scriptIds: number[]) {
    const gameDto = {
      scriptIds,
      // mapName: 'ns_arena.txt',
      mapName,
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

  return {
    frames,
    frameIndex,
    rewind,
    play,
    pause,
    showPause,
    prevFrame,
    nextFrame,
    scoreBoard,
    topBugs,
  };
}
