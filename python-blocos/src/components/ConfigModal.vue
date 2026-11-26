<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import { configuracoes } from '../services/configuracoes';
import { audio } from '../services/audio';

const emit = defineEmits(['fechar', 'tutorial', 'apagar']);

const alternarSom = () => {
  if (configuracoes.som) audio.tocar('clique');
};

const aoTecla = (e) => {
  if (e.key === 'Escape') emit('fechar');
};
onMounted(() => window.addEventListener('keydown', aoTecla));
onBeforeUnmount(() => window.removeEventListener('keydown', aoTecla));
</script>

<template>
  <div class="cfg" role="dialog" aria-modal="true" aria-label="Configurações">
    <section class="cfg__janela">
      <header class="cfg__topo">
        <h2 class="cfg__titulo">Configurações</h2>
        <button class="cfg__fechar" aria-label="Fechar configurações" @click="emit('fechar')">×</button>
      </header>

      <label class="cfg__linha">
        <input v-model="configuracoes.som" type="checkbox" @change="alternarSom" />
        <span>
          <strong>Efeitos sonoros</strong>
          <small>Sons de encaixe, acerto, erro e digitação.</small>
        </span>
      </label>

      <label class="cfg__linha">
        <input v-model="configuracoes.reduzirMovimento" type="checkbox" />
        <span>
          <strong>Reduzir movimento</strong>
          <small>Menos animações e efeitos. Vale a partir da próxima fase.</small>
        </span>
      </label>

      <label class="cfg__linha">
        <input v-model="configuracoes.modoLivre" type="checkbox" />
        <span>
          <strong>Modo livre</strong>
          <small>Deixa todas as fases abertas, sem precisar concluir as anteriores.</small>
        </span>
      </label>

      <div class="cfg__acoes">
        <button class="cfg__btn" @click="emit('tutorial')">Como jogar</button>
        <button class="cfg__btn cfg__btn--perigo" @click="emit('apagar')">Apagar progresso e recordes</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.cfg {
  position: fixed;
  inset: 0;
  z-index: 65;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(5, 8, 12, 0.88);
  backdrop-filter: blur(4px);
}
.cfg__janela {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: min(480px, 100%);
  padding: 18px 22px 20px;
  background: var(--painel);
  border: 1px solid #263445;
  border-radius: 14px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
}
.cfg__topo { display: flex; align-items: center; justify-content: space-between; }
.cfg__titulo { margin: 0; font-size: 1.2rem; }
.cfg__fechar { border: 0; background: transparent; color: var(--texto-suave); font-size: 1.6rem; line-height: 1; cursor: pointer; }

.cfg__linha { display: flex; align-items: flex-start; gap: 12px; cursor: pointer; }
.cfg__linha input { margin-top: 4px; width: 18px; height: 18px; accent-color: var(--ok); }
.cfg__linha span { display: flex; flex-direction: column; gap: 2px; }
.cfg__linha small { color: var(--texto-suave); font-size: 0.82rem; line-height: 1.35; }

.cfg__acoes { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 4px; }
.cfg__btn {
  padding: 8px 14px;
  border: 1px solid #3a4b5e;
  border-radius: 8px;
  background: transparent;
  color: var(--texto);
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
}
.cfg__btn--perigo { border-color: #7a2f35; color: #ff8a8a; }
</style>
