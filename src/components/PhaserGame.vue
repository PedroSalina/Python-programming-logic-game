<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import StartGame from '../game/main';

let game = null;
let montado = true;

const carregarFonte = () => {
  if (!document.fonts) return Promise.resolve();
  return Promise.race([
    document.fonts.load('20px "JetBrains Mono"'),
    new Promise((resolve) => setTimeout(resolve, 1500))
  ]);
};

onMounted(async () => {
  await carregarFonte();
  if (!montado) return;
  game = StartGame('game-container');
});

onBeforeUnmount(() => {
  montado = false;
  if (game) {
    game.destroy(true);
    game = null;
  }
});
</script>

<template>
  <div id="game-container" class="game-container"></div>
</template>

<style scoped>
.game-container {
  width: 100%;
  border: 1px solid #1f2a37;
  border-radius: 10px;
  overflow: hidden;
  background: var(--painel);
  touch-action: none;
}
.game-container :deep(canvas) {
  touch-action: none;
}
</style>
