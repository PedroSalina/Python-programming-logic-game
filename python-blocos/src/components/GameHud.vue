<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { stagger } from 'animejs';
import { animar, movimentoReduzido } from '../utils/movimento';
import Cronometro from './Cronometro.vue';
import Colapsavel from './Colapsavel.vue';

const props = defineProps({
  empresa: { type: String, default: '' },
  titulo: { type: String, default: '' },
  resumo: { type: String, default: '' },
  cliente: { type: Object, default: () => ({}) },
  dica: { type: String, default: '' },
  respostas: { type: Array, default: () => [] },
  linha: { type: Number, default: 0 },
  mensagem: { type: String, default: '' },
  modo: { type: String, default: 'blocos' },
  concluidas: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  nivel: { type: Number, default: 0 },
  totalNiveis: { type: Number, default: 1 },
  totalNormais: { type: Number, default: 1 },
  hard: { type: Boolean, default: false },
  idsFases: { type: Array, default: () => [] },
  concluidos: { type: Array, default: () => [] },
  trancadas: { type: Array, default: () => [] },
  restanteMs: { type: Number, default: 0 },
  cronRodando: { type: Boolean, default: false },
  pausado: { type: Boolean, default: false },
  toque: { type: Boolean, default: false }
});

defineEmits(['validar', 'limpar', 'irpara', 'verpedido', 'ranking', 'tutorial', 'config', 'inicio', 'pausa']);

const painel = ref(null);
const fasesEl = ref(null);
const abasEl = ref(null);
const tituloEl = ref(null);
const mensagemEl = ref(null);

const bloqueado = computed(() => props.modo !== 'blocos' || props.pausado);

const porcentagem = computed(() =>
  props.total ? Math.round((props.concluidas / props.total) * 100) : 0
);

const indices = computed(() => {
  const inicio = props.hard ? props.totalNormais : 0;
  const fim = props.hard ? props.totalNiveis : props.totalNormais;
  return Array.from({ length: fim - inicio }, (_, i) => inicio + i);
});

const rotuloFase = computed(() => {
  if (props.hard) {
    const numero = props.nivel - props.totalNormais + 1;
    return `Teste seu conhecimento · Desafio ${numero} de ${props.totalNiveis - props.totalNormais}`;
  }
  return `${props.empresa} · Serviço ${props.nivel + 1} de ${props.totalNormais}`;
});

const respostaAtual = computed(() => props.respostas[props.linha]);
const concluido = (indice) => props.concluidos.includes(props.idsFases[indice]);
const trancada = (indice) => Boolean(props.trancadas[indice]);
const alternar = (nome) => {
  painel.value = painel.value === nome ? null : nome;
};

const entradaFases = async () => {
  await nextTick();
  if (!fasesEl.value) return;
  animar([...fasesEl.value.children], {
    opacity: [0, 1],
    scale: [0.6, 1],
    delay: stagger(45),
    duration: 320,
    ease: 'outBack'
  });
};

onMounted(() => {
  if (abasEl.value) {
    animar([...abasEl.value.querySelectorAll('.aba')], {
      opacity: [0, 1],
      y: [-8, 0],
      delay: stagger(70),
      duration: 400,
      ease: 'outQuad'
    });
  }
  entradaFases();
});

watch(() => props.hard, entradaFases);

watch(() => props.titulo, async () => {
  await nextTick();
  if (!tituloEl.value) return;
  animar(tituloEl.value, { opacity: [0, 1], y: [8, 0], duration: 380, ease: 'outQuad' });
});

watch(() => props.mensagem, async (texto) => {
  if (!texto || movimentoReduzido()) return;
  await nextTick();
  if (!mensagemEl.value) return;
  animar(mensagemEl.value, {
    opacity: [0, 1],
    x: [{ to: -6 }, { to: 6 }, { to: -3 }, { to: 0 }],
    duration: 300,
    ease: 'outQuad'
  });
});

watch(() => props.nivel, () => {
  painel.value = null;
});
watch(() => props.concluidas, () => {
  if (painel.value === 'dica') painel.value = null;
});
</script>

<template>
  <header class="hud">
    <div ref="abasEl" class="hud__abas">
      <div class="hud__grupo" role="tablist">
        <button
          class="aba"
          :class="{ 'aba--ativa': !hard }"
          role="tab"
          :aria-selected="!hard"
          @click="$emit('irpara', 0)"
        >Serviços</button>
        <button
          class="aba aba--hard"
          :class="{ 'aba--ativa': hard, 'aba--trancada': trancada(totalNormais) }"
          role="tab"
          :aria-selected="hard"
          :disabled="trancada(totalNormais)"
          :title="trancada(totalNormais) ? 'Conclua todos os serviços para liberar' : ''"
          @click="$emit('irpara', totalNormais)"
        >Teste seu conhecimento · Hard</button>
        <button class="aba aba--ranking" @click="$emit('ranking')">Ranking</button>
      </div>
      <div class="hud__utils">
        <button class="hud__link" @click="$emit('tutorial')">Como jogar</button>
        <button class="hud__link" @click="$emit('config')">Configurações</button>
        <button class="hud__link" @click="$emit('inicio')">Menu</button>
      </div>
    </div>

    <div ref="fasesEl" class="hud__fases" aria-label="Escolher fase">
      <button
        v-for="(indice, posicao) in indices"
        :key="indice"
        class="hud__fase"
        :class="{
          'hud__fase--atual': indice === nivel,
          'hud__fase--feita': concluido(indice),
          'hud__fase--trancada': trancada(indice)
        }"
        :disabled="trancada(indice)"
        :title="trancada(indice) ? 'Conclua a fase anterior para liberar' : ''"
        :aria-label="(hard ? 'Ir para o desafio ' : 'Ir para o serviço ') + (posicao + 1)"
        @click="$emit('irpara', indice)"
      >{{ posicao + 1 }}</button>
    </div>

    <div class="hud__topo">
      <div>
        <p class="hud__empresa">{{ rotuloFase }}</p>
        <h1 ref="tituloEl" class="hud__titulo">{{ titulo }}</h1>
      </div>

      <div class="hud__acoes">
        <button class="btn btn--dica" :disabled="bloqueado" @click="alternar('dica')">
          {{ painel === 'dica' ? 'Ocultar dica' : 'Dica' }}
        </button>
        <button v-if="!hard" class="btn btn--resposta" :disabled="bloqueado" @click="alternar('resposta')">
          {{ painel === 'resposta' ? 'Ocultar resposta' : 'Resposta' }}
        </button>
        <button class="btn btn--ghost" :disabled="bloqueado" @click="$emit('verpedido')">Ver pedido</button>
        <button class="btn btn--ok" :disabled="bloqueado" @click="$emit('validar')">
          {{ toque ? 'Validar' : 'Validar (Enter)' }}
        </button>
        <button class="btn" :disabled="bloqueado" @click="$emit('limpar')">Limpar</button>
      </div>
    </div>

    <div v-if="hard" class="hud__cron">
      <Cronometro :restante-ms="restanteMs" :pausado="pausado" :rodando="cronRodando" @alternar="$emit('pausa')" />
    </div>

    <div class="hud__missao">
      <strong class="hud__cliente">{{ cliente.contato }} · {{ cliente.empresa }}:</strong> {{ resumo }}
    </div>

    <Colapsavel>
      <div v-if="painel === 'dica' && modo === 'blocos' && dica" class="hud__dica" role="note">
        <strong>Dica:</strong> {{ dica }}
      </div>
    </Colapsavel>

    <Colapsavel>
      <div v-if="painel === 'resposta' && modo === 'blocos' && respostas.length" class="hud__resposta" role="note">
        <strong class="resp__titulo">Resposta do serviço</strong>
        <ol class="resp__lista">
          <li
            v-for="(r, i) in respostas"
            :key="i"
            class="resp__linha"
            :class="{ 'resp__linha--atual': i === linha, 'resp__linha--feita': i < linha }"
          >
            <span class="resp__n">{{ i + 1 }}</span>
            <code>{{ r.codigo }}</code>
          </li>
        </ol>
        <p v-if="respostaAtual" class="resp__pecas">
          <span>Peças da linha {{ linha + 1 }}, na ordem:</span>
          <span v-for="(t, i) in respostaAtual.pecas" :key="i" class="resp__peca">{{ t }}</span>
        </p>
      </div>
    </Colapsavel>

    <div
      class="hud__progresso"
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="porcentagem"
    >
      <div class="hud__barra" :style="{ width: porcentagem + '%' }"></div>
    </div>

    <p ref="mensagemEl" class="hud__mensagem" aria-live="polite">{{ mensagem || '\u00A0' }}</p>
  </header>
</template>

<style scoped>
.hud { margin-bottom: 12px; }

.hud__abas {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.hud__grupo { display: flex; gap: 6px; grid-column: 2; flex-wrap: wrap; justify-content: center; }
.hud__utils { grid-column: 3; justify-self: end; display: flex; gap: 4px; }
.hud__link {
  padding: 6px 10px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--texto-suave);
  font-size: 0.8rem;
  cursor: pointer;
  transition: color 0.15s ease, background 0.15s ease;
}
.hud__link:hover { color: var(--texto); background: #14202e; }

.aba {
  padding: 7px 14px;
  border: 1px solid #2a3a4c;
  border-radius: 8px;
  background: transparent;
  color: var(--texto-suave);
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: color 0.15s ease, background 0.2s ease, border-color 0.2s ease;
}
.aba:hover { color: var(--texto); }
.aba--ativa { background: var(--destaque); border-color: var(--destaque); color: #06212b; }
.aba--hard { border-color: #7a2f35; color: #ff8a8a; }
.aba--hard:hover { color: #ffb0b0; border-color: #ff6b6b; }
.aba--hard.aba--ativa { background: #ff6b6b; border-color: #ff6b6b; color: #2a0709; }
.aba--trancada { opacity: 0.45; cursor: not-allowed; }
.aba--ranking { color: #ffd166; border-color: #5c4a1f; }
.aba--ranking:hover { border-color: #ffd166; }

.hud__fases { display: flex; justify-content: center; gap: 8px; margin-bottom: 14px; }
.hud__fase {
  width: 32px;
  height: 32px;
  border: 1px solid #2a3a4c;
  border-radius: 8px;
  background: transparent;
  color: var(--texto-suave);
  font-weight: 700;
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease, transform 0.15s ease;
}
.hud__fase:hover:not(:disabled) { border-color: var(--destaque); color: var(--texto); transform: translateY(-2px); }
.hud__fase--feita { box-shadow: inset 0 -3px 0 var(--ok); }
.hud__fase--atual { background: var(--destaque); border-color: var(--destaque); color: #06212b; }
.hud__fase--trancada { opacity: 0.35; cursor: not-allowed; }

.hud__topo { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap; }
.hud__empresa { margin: 0 0 2px; color: var(--destaque); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.06em; }
.hud__titulo { margin: 0; font-size: 1.4rem; }
.hud__acoes { display: flex; gap: 8px; flex-wrap: wrap; }

.hud__cron { margin-top: 12px; }

.hud__missao {
  margin-top: 12px;
  padding: 10px 14px;
  background: #14202e;
  border-left: 4px solid var(--destaque);
  border-radius: 6px;
  font-size: 0.95rem;
  line-height: 1.4;
}
.hud__cliente { color: var(--destaque); }

.hud__dica {
  margin-top: 8px;
  padding: 10px 14px;
  background: #2a2412;
  border-left: 4px solid #ffd166;
  border-radius: 6px;
  font-size: 0.93rem;
  line-height: 1.45;
  color: #f3e3b3;
}
.hud__dica strong { color: #ffd166; }

.hud__resposta {
  margin-top: 8px;
  padding: 10px 14px;
  background: #12261a;
  border-left: 4px solid var(--ok);
  border-radius: 6px;
  font-size: 0.9rem;
}
.resp__titulo { color: var(--ok); }
.resp__lista { margin: 8px 0; padding: 0; list-style: none; font-family: var(--fonte-codigo); }
.resp__linha { display: flex; align-items: baseline; gap: 10px; padding: 2px 8px; border-radius: 4px; transition: background 0.2s ease, opacity 0.2s ease; }
.resp__linha code { white-space: pre; font-family: var(--fonte-codigo); }
.resp__n { flex: none; width: 1.2em; color: #5c6b7a; text-align: right; }
.resp__linha--feita { opacity: 0.45; }
.resp__linha--atual { background: rgba(46, 204, 113, 0.18); outline: 1px solid rgba(46, 204, 113, 0.5); }
.resp__pecas { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin: 0; color: var(--texto-suave); font-size: 0.85rem; }
.resp__peca {
  padding: 1px 8px;
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 4px;
  color: var(--texto);
  font-family: var(--fonte-codigo);
}
.resp__peca + .resp__peca::before { content: '→'; margin-right: 6px; color: var(--texto-suave); font-family: system-ui, sans-serif; }

.btn {
  padding: 8px 16px;
  border: 0;
  border-radius: 8px;
  background: #5c6b7a;
  color: #fff;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: filter 0.15s ease, transform 0.1s ease;
}
.btn:hover:not(:disabled) { filter: brightness(1.12); }
.btn:active:not(:disabled) { transform: scale(0.97); }
.btn--ok { background: var(--ok); color: #06210f; }
.btn--dica { background: #ffd166; color: #2a2006; }
.btn--resposta { background: transparent; border: 1px solid var(--ok); color: var(--ok); }
.btn--ghost { background: transparent; border: 1px solid #3a4b5e; color: var(--texto); }
.btn:disabled { opacity: 0.4; cursor: not-allowed; }

.hud__progresso { height: 6px; margin-top: 12px; background: #1b2a3a; border-radius: 3px; overflow: hidden; }
.hud__barra { height: 100%; background: var(--ok); transition: width 0.45s cubic-bezier(0.22, 1, 0.36, 1); }

.hud__mensagem { min-height: 1.4em; margin: 8px 0 0; color: var(--erro); font-size: 0.95rem; }

@media (max-width: 700px) {
  .hud__abas { grid-template-columns: 1fr; justify-items: center; }
  .hud__grupo, .hud__utils { grid-column: 1; justify-self: center; }
}
</style>
