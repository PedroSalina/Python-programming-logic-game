<script setup>
import { nextTick, ref, onMounted, onBeforeUnmount } from 'vue';
import { stagger } from 'animejs';
import { recordes } from '../services/recordes';
import { formatarDuracao } from '../utils/tempo';
import { animar } from '../utils/movimento';

defineProps({
  desafios: { type: Array, default: () => [] }
});
const emit = defineEmits(['fechar', 'limpar']);

const raiz = ref(null);
const dados = ref({});

const carregar = async () => {
  dados.value = await recordes.listarTodos();
  await nextTick();
  if (!raiz.value) return;
  animar([...raiz.value.querySelectorAll('.rank__desafio')], {
    opacity: [0, 1],
    y: [12, 0],
    delay: stagger(90),
    duration: 380,
    ease: 'outQuad'
  });
  animar([...raiz.value.querySelectorAll('.rank__tabela tbody tr')], {
    opacity: [0, 1],
    x: [-12, 0],
    delay: (el, i) => 200 + i * 45,
    duration: 320,
    ease: 'outQuad'
  });
};

const formatarData = (marca) => new Date(marca).toLocaleDateString('pt-BR');

const aoTecla = (e) => {
  if (e.key === 'Escape') emit('fechar');
};

onMounted(() => {
  window.addEventListener('keydown', aoTecla);
  carregar();
});
onBeforeUnmount(() => window.removeEventListener('keydown', aoTecla));
</script>

<template>
  <div class="rank" role="dialog" aria-modal="true" aria-label="Ranking de recordes">
    <section ref="raiz" class="rank__janela">
      <header class="rank__topo">
        <h2 class="rank__titulo">Ranking · Meus melhores tempos</h2>
        <button class="rank__fechar" aria-label="Fechar ranking" @click="emit('fechar')">×</button>
      </header>

      <p class="rank__aviso">Os tempos ficam salvos neste navegador e valem para os desafios do nível hard.</p>

      <div class="rank__corpo">
        <article v-for="desafio in desafios" :key="desafio.id" class="rank__desafio">
          <h3 class="rank__nome">
            {{ desafio.titulo }}
            <span class="rank__limite">limite {{ formatarDuracao(desafio.limite * 1000) }}</span>
          </h3>

          <table v-if="(dados[desafio.id] || []).length" class="rank__tabela">
            <thead>
              <tr><th>#</th><th>Tempo</th><th>Situação</th><th>Data</th></tr>
            </thead>
            <tbody>
              <tr v-for="(r, i) in dados[desafio.id]" :key="i" :class="{ 'rank__melhor': i === 0 }">
                <td>{{ i + 1 }}</td>
                <td>{{ formatarDuracao(r.tempoMs) }}</td>
                <td :class="r.noPrazo ? 'rank__ok' : 'rank__atraso'">{{ r.noPrazo ? 'No prazo' : 'Com atraso' }}</td>
                <td>{{ formatarData(r.data) }}</td>
              </tr>
            </tbody>
          </table>
          <p v-else class="rank__vazio">Nenhum tempo registrado ainda.</p>
        </article>
      </div>

      <footer class="rank__rodape">
        <button class="rank__limpar" @click="emit('limpar')">Limpar recordes</button>
        <button class="rank__ok-btn" autofocus @click="emit('fechar')">Fechar</button>
      </footer>
    </section>
  </div>
</template>

<style scoped>
.rank {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(5, 8, 12, 0.88);
  backdrop-filter: blur(4px);
}
.rank__janela {
  display: flex;
  flex-direction: column;
  width: min(640px, 100%);
  max-height: 92vh;
  background: var(--painel);
  border: 1px solid #5a2a2f;
  border-radius: 14px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
}
.rank__topo { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px 0; }
.rank__titulo { margin: 0; font-size: 1.2rem; }
.rank__fechar { border: 0; background: transparent; color: var(--texto-suave); font-size: 1.6rem; line-height: 1; cursor: pointer; }
.rank__aviso { margin: 6px 20px 0; color: var(--texto-suave); font-size: 0.85rem; }
.rank__corpo { display: flex; flex-direction: column; gap: 14px; padding: 14px 20px; overflow-y: auto; }

.rank__desafio { padding: 12px 14px; background: #14202e; border-radius: 10px; }
.rank__nome { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; margin: 0 0 8px; font-size: 1rem; }
.rank__limite { font-size: 0.75rem; font-weight: 400; color: var(--texto-suave); }

.rank__tabela { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
.rank__tabela th { padding: 4px 8px; text-align: left; font-size: 0.7rem; letter-spacing: 0.06em; text-transform: uppercase; color: var(--texto-suave); }
.rank__tabela td { padding: 5px 8px; border-top: 1px solid #1f2a37; }
.rank__melhor td { color: #ffd166; font-weight: 700; }
.rank__ok { color: var(--ok); }
.rank__atraso { color: var(--erro); }
.rank__vazio { margin: 0; color: var(--texto-suave); font-size: 0.9rem; }

.rank__rodape { display: flex; justify-content: space-between; gap: 10px; padding: 0 20px 16px; }
.rank__limpar {
  padding: 8px 14px;
  border: 1px solid #5a2a2f;
  border-radius: 8px;
  background: transparent;
  color: #ff8a8a;
  cursor: pointer;
}
.rank__ok-btn {
  padding: 8px 22px;
  border: 0;
  border-radius: 8px;
  background: var(--ok);
  color: #06210f;
  font-weight: 700;
  cursor: pointer;
}
</style>
