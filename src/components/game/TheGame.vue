<script setup lang="ts">
import ReplayViewer from '@/components/replayViewer/ReplayViewer.vue';
import { useReplayViewer } from '@/composables/useReplayViewer';
import Button from 'primevue/button';
import Slider from 'primevue/slider';
import { useRoute } from 'vue-router';

const bugImgs: Record<number, string> = {
  0: new URL('@/assets/img/bug-red.png', import.meta.url).href,
  1: new URL('@/assets/img/bug-blue.png', import.meta.url).href,
  2: new URL('@/assets/img/bug-green.png', import.meta.url).href,
  3: new URL('@/assets/img/bug-purple.png', import.meta.url).href,
};

const route = useRoute();

const {
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
} = await useReplayViewer(route.query);
</script>

<template>
  <div class="grander-game-container"></div>
  <div class="grand-game-container">
    <div class="game-container">
      <div class="scoreboard">
        <template v-for="topBug in topBugs" :key="topBug">
          <img :src="bugImgs[topBug]" />
          <span class="score" data-test="score">{{ scoreboard[topBug].scores[frameIndex] }}</span>
          <span>
            <div>{{ scoreboard[topBug].name }}</div>
            <div class="script-author">{{ scoreboard[topBug].author }}</div>
          </span>
        </template>
      </div>
      <div class="replay-viewer-grid-cell">
        <h1 class="header">REPLAY VIEWER</h1>
        <ReplayViewer :frame="frames[frameIndex]" />
      </div>
      <div></div>
      <div></div>
      <div class="replay-controls">
        <div>
          <Slider
            class="slider"
            v-model="frameIndex"
            :min="0"
            :max="frames.length - 1"
            @change="pause"
          />
        </div>
        <div class="vcr-controls">
          <div>
            <Button @click="rewind" icon="pi pi-fast-backward" />
            <Button v-if="showPause" @click="pause" icon="pi pi-pause" data-test="pause-button" />
            <Button v-else @click="play(500)" icon="pi pi-play" data-test="play-button" />
            <Button @click="play(100)" icon="pi pi-forward" data-test="ff-button" />
            <Button @click="play(30)" icon="pi pi-fast-forward" data-test="fff-button" />
          </div>
          <div>
            <Button @click="prevFrame" icon="pi pi-step-backward-alt" :disabled="frameIndex == 0" />
            <Button
              @click="nextFrame"
              icon="pi pi-step-forward-alt"
              :disabled="frameIndex >= frames.length - 1"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grand-game-container {
  margin-block: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.header {
  margin: 0 auto;
  margin-bottom: 20px;
  width: fit-content;
  color: #fff;
}

.game-container {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-template-rows: auto 1fr;
}

.scoreboard {
  justify-self: end;
  align-self: center;
  margin-right: 30px;

  display: grid;
  grid-template-columns: auto 1.5rem auto;
  align-items: center;
  row-gap: 1rem;
  column-gap: 1rem;
  color: #fff;
  background-color: rgba(18, 18, 18, 0.85);
  border: 1px solid #fff;
  padding: 20px;
}

.score {
  justify-self: right;
}

.script-author {
  font-size: 0.8rem;
}

.leader-star {
  display: inline-block;
  width: 20px;
  color: gold;
}

.replay-viewer-grid-cell {
  background-color: rgba(18, 18, 18, 0.85);
  border: 1px solid #fff;
  padding: 50px;
  max-width: 60vh;
}

.replay-controls {
  margin-top: 30px;
  padding-block: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: rgba(18, 18, 18, 0.85);
  border: 1px solid #fff;
  padding: 30px;
}

.vcr-controls {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  gap: 2rem;
}

.vcr-controls div {
  display: flex;
  gap: 1rem;
}

.vcr-controls .p-button {
  border: 1px solid #fff;
  width: 50px;
}

.vcr-controls .p-button:focus {
  box-shadow: none;
}

.slider {
  width: 100%;
}

@media screen and (max-width: 600px) {
  .game-container {
    display: flex;
    flex-direction: column;
    grid-template-columns: 1fr auto 1fr;
    grid-template-rows: auto 1fr;
    margin-inline: 10px;
  }

  .scoreboard {
    margin: 0;
    margin-bottom: 20px;
  }

  .replay-viewer-grid-cell {
    max-width: 100%;
  }

  .vcr-controls {
    flex-direction: column;
    align-items: center;
  }
}
</style>
