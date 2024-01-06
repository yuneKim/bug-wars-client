<script setup lang="ts">
</script>

<template>
    <div>
        <!-- logo goes here -->
        <button><router-link v-bind:to="{name: 'gameLobby'}" data-test="gameLobby">Play Game</router-link></button>
        <button><router-link v-bind:to="{name: 'scriptEditor'}" data-test="scriptEditor">Script Editor</router-link></button>
        <button><router-link v-bind:to="{name: 'howToPlay'}" data-test="howToPlay">How to Play</router-link></button>
        <button><router-link v-bind:to="{name: 'credits'}" data-test="credits">Credits</router-link></button>
    </div>
</template>

<style scoped></style>