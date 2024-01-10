<script setup lang="ts">
import { cloneDeep } from 'lodash-es';
import { ref } from 'vue';

const str =
  '01010101010101010101010101010101010101010101010101010101010101 01000000000000000100010000000000000000000100010000000000000001 01000000000000000000010001011111110101000100000000000000000001 01000000000000000000010011001100110011000100000000000000000001 01000000010001000000010000000000000000000100000001000100000001 01000000000001000000000001000000000001000000000001000000000001 01000000010101000000010059000000000059000100000001010100000001 01000000000000000000010000000000000000000100000000000000000001 01010000000000000027010000000000000000000111000000000000000101 01000000000000002300010000000000000000000100150000000000000001 01010101010001010101010100000000000000010101010101000101010101 01000000000000000000010000000000000000000100000000000000000001 01000123000139000000000000000100000000000000000031010047010001 01000100000000000000000000000000000000000000000000000000010001 01002323000000000000000000000200020001000000000000000047470001 01002300000000000000000000000002000000000000000000000000470001 01002323000000000000000001000200020000000000000000000047470001 01000100000000000000000000000000000000000000000000000000010001 01000123000139000000000000000000010000000000000031010047010001 01000000000000000000010000000000000000000100000000000000000001 01010101010001010101010100000000000000010101010101000101010101 01000000000000005500010000000000000000000100470000000000000001 01010000000000000051010000000000000000000135000000000000000101 01000000000000000000010000000000000000000100000000000000000001 01000000010101000000010003000000000003000100000001010100000001 01000000000001000000000001000000000001000000000001000000000001 01000000010001000000010000000000000000000100000001000100000001 01000000000000000000010051005100510051000100000000000000000001 01000000000000000000010001015151510101000100000000000000000001 01000000000000000100010000000000000000000100010000000000000001 01010101010101010101010101010101010101010101010101010101010101 ';

const ticks: BattleSummary = [
  [
    {
      coords: {
        x: 14.0,
        y: 2.0,
      },
      action: 0,
    },
    {
      coords: {
        x: 2.0,
        y: 14.0,
      },
      action: 11,
    },
    {
      coords: {
        x: 28.0,
        y: 16.0,
      },
      action: 10,
    },
  ],
  [
    {
      coords: {
        x: 16.0,
        y: 28.0,
      },
      action: 10,
    },
    {
      coords: {
        x: 16.0,
        y: 2.0,
      },
      action: 0,
    },
    {
      coords: {
        x: 2.0,
        y: 16.0,
      },
      action: 11,
    },
  ],
  [
    {
      coords: {
        x: 28.0,
        y: 14.0,
      },
      action: 10,
    },
    {
      coords: {
        x: 14.0,
        y: 28.0,
      },
      action: 10,
    },
    {
      coords: {
        x: 15.0,
        y: 2.0,
      },
      action: 12,
    },
  ],
  [
    {
      coords: {
        x: 2.0,
        y: 15.0,
      },
      action: 10,
    },
    {
      coords: {
        x: 28.0,
        y: 15.0,
      },
      action: 10,
    },
    {
      coords: {
        x: 15.0,
        y: 28.0,
      },
      action: 10,
    },
  ],
  [
    {
      coords: {
        x: 12.0,
        y: 3.0,
      },
      action: 12,
    },
    {
      coords: {
        x: 3.0,
        y: 12.0,
      },
      action: 10,
    },
    {
      coords: {
        x: 27.0,
        y: 18.0,
      },
      action: 10,
    },
  ],
  [
    {
      coords: {
        x: 18.0,
        y: 27.0,
      },
      action: 10,
    },
    {
      coords: {
        x: 18.0,
        y: 3.0,
      },
      action: 12,
    },
    {
      coords: {
        x: 3.0,
        y: 18.0,
      },
      action: 10,
    },
  ],
  [
    {
      coords: {
        x: 27.0,
        y: 12.0,
      },
      action: 10,
    },
    {
      coords: {
        x: 12.0,
        y: 27.0,
      },
      action: 10,
    },
  ],
];

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

type BattleSummary = TickSummary[];

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
        })
    );

  return map as Entity[][];
}

function unpackReplay() {
  frames.value[0] = unsquash(str);
  for (let i = 0; i < ticks.length; i++) {
    const prevFrame = frames.value[i];
    const nextFrame = cloneDeep(prevFrame);
    for (const action of ticks[i]) {
      const { x, y } = action.coords;
      const cell = nextFrame[y][x];
      if (cell.type !== 'bug') throw new Error('Problem with data');
      if (commands[action.action] === 'mov') {
        const { x: dx, y: dy } = getDirectionVector(cell.direction);
        const nextCell = nextFrame[y + dy][x + dx];
        if (nextCell.type === 'empty') {
          nextFrame[y + dy][x + dx] = cell;
          nextFrame[y][x] = { type: 'empty' };
        }
      } else if (commands[action.action] === 'rotr') {
        cell.direction = rotateDirection(cell.direction, 1);
      } else if (commands[action.action] === 'rotl') {
        cell.direction = rotateDirection(cell.direction, -1);
      } else if (commands[action.action] === 'att') {
        const { x: dx, y: dy } = getDirectionVector(cell.direction);
        const nextCell = nextFrame[y + dy][x + dx];
        if (nextCell.type === 'bug') {
          nextFrame[y + dy][x + dx] = { type: 'empty' };
        }
      } else if (commands[action.action] === 'eat') {
        const { x: dx, y: dy } = getDirectionVector(cell.direction);
        const nextCell = nextFrame[y + dy][x + dx];
        if (nextCell.type === 'food') {
          nextFrame[y + dy][x + dx] = cell;
          nextFrame[y][x] = { type: 'empty' };
        }
      }
    }
    frames.value.push(nextFrame);
  }
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

unpackReplay();
console.log(frames);
</script>

<template>
  <div class="container">
    <div v-if="frames.length > 0" class="battlefield">
      <div class="row" v-for="(row, y) in frames[frameIndex]" :key="y">
        <div :class="`cell ${cell.type}`" v-for="(cell, x) in row" :key="x">
          <div v-if="cell.type === 'bug'" :class="`swarm-${cell.swarm + 1}`">
            <img :class="`face-${cell.direction}`" src="@/assets/right-arrow.png" width="10" />
          </div>
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
  background: #000;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.row {
  display: flex;
  gap: 1px;
}

.cell {
  width: 10px;
  height: 10px;
}

.wall {
  background-color: #000;
}

.empty {
  background-color: #fff;
}

.food {
  background-color: #0f0;
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
  transform: rotate(270deg);
}

.face-east {
  transform: rotate(0deg);
}

.face-south {
  transform: rotate(90deg);
}

.face-west {
  transform: rotate(180deg);
}

.vcr-controls {
  display: flex;
  gap: 1rem;
}

.vcr-controls button {
  width: 50px;
}
</style>
