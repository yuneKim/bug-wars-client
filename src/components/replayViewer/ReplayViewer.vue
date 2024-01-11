<script setup lang="ts">
import { gameService } from '@/services/gameService';
import { cloneDeep } from 'lodash-es';
import { onMounted, ref } from 'vue';

type Direction = 'north' | 'east' | 'south' | 'west';

type Entity = Wall | Food | Bug | Empty;

type Wall = {
  type: 'wall';
};

type Food = {
  type: 'food';
};

type Bug = {
  type: 'bug';
  direction: Direction;
  swarm: number;
};

type Empty = {
  type: 'empty';
};

type ActionSummary = {
  coords: {
    x: number;
    y: number;
  };
  action: number;
};

type TickSummary = ActionSummary[];

type BattleGrid = Entity[][];

const frames = ref<BattleGrid[]>([]);
const frameIndex = ref(0);
const timer = ref(0);

const directions: Record<number, Direction> = {
  0: 'north',
  1: 'east',
  2: 'south',
  3: 'west',
};

const commands: Record<number, string> = {
  0: 'noop',
  10: 'mov',
  11: 'rotr',
  12: 'rotl',
  13: 'att',
  14: 'eat',
};

const bugImgs: Record<number, string> = {
  0: new URL('@/assets/img/bug-red.jpg', import.meta.url).href,
  1: new URL('@/assets/img/bug-blue.jpg', import.meta.url).href,
  2: new URL('@/assets/img/bug-green.jpg', import.meta.url).href,
  3: new URL('@/assets/img/bug-purple.jpg', import.meta.url).href,
};

function unsquash(str: string): Entity[][] {
  const map = str
    .split(' ')
    .filter((s) => s.length > 0)
    .map(
      (s) =>
        // split string into groups of 2 characters
        s.match(/.{1,2}/g)?.map((s) => {
          // each group is a decimal representation of a binary number
          const n = parseInt(s, 10);
          // last 2 bits are entity type
          if (n === 0) {
            return { type: 'empty' } as Empty;
          } else if (n === 1) {
            return { type: 'wall' } as Wall;
          } else if (n === 2) {
            return { type: 'food' } as Food;
          } else if (n >= 3) {
            // center 2 bits are direction
            const directionBits = n.toString(2).slice(-4, -2) || '00';
            const directionIndex = parseInt(directionBits, 2);
            // first 2 bits are swarm
            const swarmBits = n.toString(2).slice(0, -4) || '00';
            const swarm = parseInt(swarmBits, 2);
            return {
              type: 'bug',
              direction: directions[directionIndex],
              swarm,
            } as Bug;
          } else {
            throw new Error('Unknown entity');
          }
        }),
    );

  return map as Entity[][];
}

function unpackReplay(battleground: string, ticks: TickSummary[] = []) {
  frames.value[0] = unsquash(battleground);
  for (let i = 0; i < ticks.length; i++) {
    const prevFrame = frames.value[i];
    const nextFrame = cloneDeep(prevFrame);
    for (const action of ticks[i]) {
      const { x, y } = action.coords;
      const cell = nextFrame[y][x];
      if (cell.type !== 'bug') {
        console.log(action);
        throw new Error(`Problem with data on tick ${i}`);
      }
      if (commands[action.action] === 'mov') {
        const { x: dx, y: dy } = getDirectionVector(cell.direction);
        const nextCell = nextFrame[y + dy][x + dx];
        if (nextCell.type === 'empty') {
          nextFrame[y + dy][x + dx] = cell;
          nextFrame[y][x] = { type: 'empty' };
        }
      } else if (commands[action.action] === 'rotr') {
        cell.direction = rotateDirection(cell.direction, -1);
      } else if (commands[action.action] === 'rotl') {
        cell.direction = rotateDirection(cell.direction, 1);
      } else if (commands[action.action] === 'att') {
        const { x: dx, y: dy } = getDirectionVector(cell.direction);
        const nextCell = nextFrame[y + dy][x + dx];
        if (nextCell.type === 'bug') {
          nextFrame[y + dy][x + dx] = { type: 'food' };
        } else if (nextCell.type === 'food') {
          nextFrame[y + dy][x + dx] = { type: 'empty' };
        }
      } else if (commands[action.action] === 'eat') {
        const { x: dx, y: dy } = getDirectionVector(cell.direction);
        const nextCell = nextFrame[y + dy][x + dx];
        if (nextCell.type === 'food') {
          const newBug = {
            type: 'bug',
            direction: faceCenter(x + dx, y + dy, nextFrame),
            swarm: cell.swarm,
          } as Bug;
          nextFrame[y + dy][x + dx] = newBug;
        }
      }
    }
    frames.value.push(nextFrame);
  }
}

function faceCenter(x: number, y: number, frame: BattleGrid): Direction {
  const centerX = Math.floor(frame[0].length / 2);
  const centerY = Math.floor(frame.length / 2);
  const slope = x == centerX ? Infinity : (-1 * (centerY - y)) / (centerX - x);

  if (slope > -1 && slope < 1) {
    return x > centerX ? 'west' : 'east';
  }
  return y > centerY ? 'north' : 'south';
}

function getDirectionVector(direction: Direction) {
  if (direction === 'north') {
    return { x: 0, y: -1 };
  } else if (direction === 'east') {
    return { x: 1, y: 0 };
  } else if (direction === 'south') {
    return { x: 0, y: 1 };
  } else if (direction === 'west') {
    return { x: -1, y: 0 };
  } else {
    throw new Error('Unknown direction');
  }
}

function rotateDirection(direction: Direction, amount: number) {
  const directions = ['north', 'east', 'south', 'west'];
  const index = directions.indexOf(direction);
  const newIndex = (index + amount + 4) % 4;
  return directions[newIndex] as Direction;
}

function rewind() {
  clearInterval(timer.value);
  timer.value = setIntervalImmediately(() => {
    frameIndex.value--;
    if (frameIndex.value <= 0) {
      clearInterval(timer.value);
    }
  }, 100);
}

function play() {
  clearInterval(timer.value);
  timer.value = setIntervalImmediately(() => {
    frameIndex.value++;
    if (frameIndex.value >= frames.value.length - 1) {
      clearInterval(timer.value);
    }
  }, 500);
}

function fastForward() {
  clearInterval(timer.value);
  timer.value = setIntervalImmediately(() => {
    frameIndex.value++;
    if (frameIndex.value >= frames.value.length - 1) {
      clearInterval(timer.value);
    }
  }, 100);
}

function pause() {
  clearInterval(timer.value);
}

function setIntervalImmediately(func: Function, interval: number) {
  func();
  return window.setInterval(func, interval);
}

async function getReplay() {
  const gameDto = {
    scriptIds: [1, 2, 1, 2],
    // mapName: 'ns_arena.txt',
    mapName: 'ns_fortress4.txt',
  };
  const response = await gameService.getReplay(gameDto);

  if (response.type === 'success') {
    const { battleground, replay } = response.data;
    console.log(replay);
    unpackReplay(battleground, replay);
  } else {
    console.error('uh oh', response.status, response.error);
  }
}

onMounted(getReplay);
</script>

<template>
  <div class="container">
    <div v-if="frames.length > 0" class="battlefield">
      <div class="row" v-for="(row, y) in frames[frameIndex]" :key="y">
        <div :class="`cell ${cell.type}`" v-for="(cell, x) in row" :key="x">
          <div v-if="cell.type === 'bug'" :class="`swarm-${cell.swarm + 1}`" :title="`${x}, ${y}`">
            <img :class="`face-${cell.direction}`" :src="bugImgs[cell.swarm]" width="20" />
          </div>
          <div v-if="cell.type === 'food'"></div>
        </div>
      </div>
    </div>
  </div>
  <div>
    <button @click="frameIndex--" :disabled="frameIndex == 0">Previous</button>
    <button @click="frameIndex++" :disabled="frameIndex >= frames.length - 1">Next</button>
    <div>
      <input type="range" v-model="frameIndex" :min="0" :max="frames.length - 1" />
    </div>
  </div>
  <div class="vcr-controls">
    <button @click="rewind">{{ '<<' }}</button>
    <button @click="pause">{{ '||' }}</button>
    <button @click="play">{{ '>' }}</button>
    <button @click="fastForward">{{ '>>' }}</button>
  </div>
</template>

<style scoped>
.container {
  display: inline-block;
}

.battlefield {
  padding: 1px;
  background: #545454;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.row {
  display: flex;
  gap: 1px;
}

.cell {
  width: 20px;
  height: 20px;
}

.wall {
  background: #545454;
}

.empty {
  background-color: #000;
}

.food {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
}

.food div {
  background-color: #0f0;
  height: 14px;
  width: 14px;
  border-radius: 7px;
}

.bug {
  background-color: rgb(226, 226, 226);
}

.bug div {
  width: 100%;
  height: 100%;
  font-size: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.swarm-1 {
  background-color: rgb(255, 0, 0);
}

.swarm-2 {
  background-color: rgb(255, 0, 255);
}

.swarm-3 {
  background-color: rgb(0, 0, 255);
}

.swarm-4 {
  background-color: rgb(255, 255, 0);
}

.face-north {
  transform: rotate(0deg);
}

.face-east {
  transform: rotate(90deg);
}

.face-south {
  transform: rotate(180deg);
}

.face-west {
  transform: rotate(270deg);
}

.vcr-controls {
  display: flex;
  gap: 1rem;
}

.vcr-controls button {
  width: 50px;
}
</style>
