<script setup>
import { onMounted, onBeforeUnmount } from 'vue';

defineProps({
  titulo: { type: String, default: '' },
  texto: { type: String, default: '' },
  rotulo: { type: String, default: 'Confirmar' }
});
const emit = defineEmits(['confirmar', 'cancelar']);

const aoTecla = (e) => {
  if (e.key === 'Escape') emit('cancelar');
};
onMounted(() => window.addEventListener('keydown', aoTecla));
onBeforeUnmount(() => window.removeEventListener('keydown', aoTecla));
</script>

<template>
  <div class="conf" role="alertdialog" aria-modal="true" :aria-label="titulo">
    <section class="conf__janela">
      <h2 class="conf__titulo">{{ titulo }}</h2>
      <p class="conf__texto">{{ texto }}</p>
      <div class="conf__acoes">
        <button class="conf__btn" autofocus @click="emit('cancelar')">Cancelar</button>
        <button class="conf__btn conf__btn--perigo" @click="emit('confirmar')">{{ rotulo }}</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.conf {
  position: fixed;
  inset: 0;
  z-index: 90;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(5, 8, 12, 0.8);
  backdrop-filter: blur(3px);
}
.conf__janela {
  width: min(420px, 100%);
  padding: 20px 22px;
  background: var(--painel);
  border: 1px solid #5a2a2f;
  border-radius: 14px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
}
.conf__titulo { margin: 0 0 8px; font-size: 1.15rem; }
.conf__texto { margin: 0 0 16px; color: var(--texto-suave); line-height: 1.45; font-size: 0.95rem; }
.conf__acoes { display: flex; justify-content: flex-end; gap: 10px; }
.conf__btn {
  padding: 8px 18px;
  border: 1px solid #3a4b5e;
  border-radius: 8px;
  background: transparent;
  color: var(--texto);
  font-weight: 700;
  cursor: pointer;
}
.conf__btn--perigo { background: var(--erro); border-color: var(--erro); color: #2a0709; }
</style>
