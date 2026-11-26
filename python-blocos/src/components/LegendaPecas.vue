<script setup>
import { TIPOS, corCss } from '../game/tipos';

const itens = Object.values(TIPOS);
</script>

<template>
  <section class="legenda" aria-label="Legenda das peças">
    <h2 class="legenda__titulo">Peças</h2>
    <ul class="legenda__lista">
      <li v-for="tipo in itens" :key="tipo.nome" class="legenda__item" :title="tipo.ajuda">
        <span class="legenda__cor" :style="{ background: corCss(tipo.cor) }"></span>
        <span class="legenda__nome">{{ tipo.nome }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.legenda { opacity: 0.75; transition: opacity 0.2s; }
.legenda:hover { opacity: 1; }

.legenda__titulo {
  margin: 0 0 8px;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--texto-suave);
}
.legenda__lista { display: flex; flex-direction: column; gap: 8px; margin: 0; padding: 0; list-style: none; }
.legenda__item { display: flex; align-items: center; gap: 8px; font-size: 0.78rem; color: var(--texto-suave); cursor: help; }
.legenda__cor { flex: none; width: 10px; height: 10px; border-radius: 3px; }

@media (max-width: 900px) {
  .legenda__lista { flex-direction: row; flex-wrap: wrap; gap: 6px 14px; }
}
</style>
