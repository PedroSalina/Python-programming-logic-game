<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { formatarDuracao } from '../utils/tempo';
import { animar, contar, movimentoReduzido } from '../utils/movimento';

const props = defineProps({
  hard: { type: Boolean, default: false },
  remetente: { type: String, default: '' },
  saida: { type: String, default: '' },
  agradecimento: { type: String, default: '' },
  aprendizado: { type: String, default: '' },
  resultado: { type: Object, default: null },
  rotuloPrimario: { type: String, default: '' },
  rotuloSecundario: { type: String, default: '' }
});
const emit = defineEmits(['continuar', 'secundaria']);

const raiz = ref(null);
const confete = ref(null);
const saidaMostrada = ref('');
const tempoMostrado = ref(0);

const CORES = ['#4cc9f0', '#ffd166', '#2ecc71', '#b388ff', '#ff9f43', '#ff6b6b'];

let enviado = false;
const continuar = () => {
  if (enviado) return;
  enviado = true;
  emit('continuar');
};
const aoTecla = (e) => {
  if (e.key === 'Enter' && !e.repeat) {
    e.preventDefault();
    continuar();
  }
};

const lancarConfete = () => {
  if (movimentoReduzido() || !confete.value) return;
  const pecas = Array.from({ length: 46 }, () => {
    const el = document.createElement('i');
    el.className = 'confete__peca';
    el.style.background = CORES[Math.floor(Math.random() * CORES.length)];
    confete.value.appendChild(el);
    return el;
  });
  animar(pecas, {
    x: () => (Math.random() - 0.5) * 760,
    y: () => Math.random() * 380 - 140,
    rotate: () => Math.random() * 720,
    opacity: [1, 0],
    scale: [1, 0.6],
    duration: () => 1100 + Math.random() * 900,
    ease: 'outCubic',
    onComplete: () => pecas.forEach((p) => p.remove())
  });
};

watch(
  () => props.resultado,
  (resultado) => {
    if (resultado) contar(resultado.tempoMs, 900, (v) => { tempoMostrado.value = v; }, 500);
  },
  { immediate: true }
);

onMounted(() => {
  window.addEventListener('keydown', aoTecla);

  const blocos = [...raiz.value.querySelectorAll(
    '.vitoria__resultado, .vitoria__saida, .vitoria__resposta, .vitoria__aprendizado, .vitoria__acoes'
  )];
  blocos.forEach((el) => { el.style.opacity = 0; });

  animar(raiz.value.querySelector('.vitoria__titulo'), { scale: [0, 1], duration: 600, ease: 'outBack' });
  animar(blocos, {
    opacity: [0, 1],
    y: [14, 0],
    delay: (el, i) => 300 + i * 130,
    duration: 420,
    ease: 'outQuad'
  });
  contar(props.saida.length, Math.min(900, props.saida.length * 55), (v) => {
    saidaMostrada.value = props.saida.slice(0, Math.round(v));
  }, 700);
  lancarConfete();
});

onBeforeUnmount(() => window.removeEventListener('keydown', aoTecla));
</script>

<template>
  <div ref="raiz" class="vitoria" role="dialog" aria-label="Fase concluída">
    <div ref="confete" class="confete" aria-hidden="true"></div>

    <h2 class="vitoria__titulo">{{ hard ? 'DESAFIO CONCLUÍDO!' : 'SERVIÇO ENTREGUE!' }}</h2>

    <div v-if="resultado" class="vitoria__resultado" :class="{ 'vitoria__resultado--atraso': !resultado.noPrazo }">
      <span>Tempo: <strong>{{ formatarDuracao(tempoMostrado) }}</strong></span>
      <span v-if="resultado.noPrazo">Concluído no prazo</span>
      <span v-else>Concluído com atraso (+{{ formatarDuracao(resultado.atrasoMs) }})</span>
      <span v-if="resultado.recorde" class="vitoria__recorde">Melhor tempo pessoal!</span>
    </div>

    <div class="vitoria__saida">
      <span class="vitoria__rotulo">Saída do programa</span>
      <code>&gt; {{ saidaMostrada }}</code>
    </div>

    <p v-if="agradecimento" class="vitoria__resposta">
      <strong>{{ remetente }} respondeu:</strong> “{{ agradecimento }}”
    </p>

    <p class="vitoria__aprendizado"><strong>O que você aprendeu:</strong> {{ aprendizado }}</p>

    <div class="vitoria__acoes">
      <button class="vitoria__btn" autofocus @click="continuar">{{ rotuloPrimario }}</button>
      <button v-if="rotuloSecundario" class="vitoria__btn vitoria__btn--sec" @click="emit('secundaria')">
        {{ rotuloSecundario }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.vitoria {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  text-align: center;
  background: rgba(0, 0, 0, 0.86);
  border-radius: 10px;
  overflow-y: auto;
}
.vitoria__titulo { margin-top: auto; }
.vitoria__acoes { margin-bottom: auto; }

.confete { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
.confete :deep(.confete__peca) {
  position: absolute;
  left: 50%;
  top: 36%;
  width: 9px;
  height: 14px;
  border-radius: 2px;
}

.vitoria__titulo {
  margin-bottom: 0;
  font-size: 2.2rem;
  color: #3fb950;
  font-family: var(--fonte-codigo);
}

.vitoria__resultado {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px 16px;
  padding: 8px 16px;
  background: #12261a;
  border: 1px solid #1f5a33;
  border-radius: 8px;
  font-size: 0.95rem;
}
.vitoria__resultado--atraso { background: #2a1214; border-color: #7a2f35; color: #ffd0d0; }
.vitoria__recorde { color: #ffd166; font-weight: 700; }

.vitoria__saida {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 220px;
  padding: 10px 18px;
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 8px;
}
.vitoria__rotulo { font-size: 0.75rem; color: var(--texto-suave); text-transform: uppercase; letter-spacing: 0.06em; }
.vitoria__saida code { min-height: 1.4em; color: #3fb950; font-size: 1.1rem; font-family: var(--fonte-codigo); }

.vitoria__resposta {
  max-width: 560px;
  margin: 0;
  padding: 10px 14px;
  background: #14202e;
  border-left: 4px solid var(--destaque);
  border-radius: 6px;
  line-height: 1.45;
  text-align: left;
}
.vitoria__aprendizado { max-width: 560px; margin: 0; line-height: 1.45; color: var(--texto-suave); }

.vitoria__acoes { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: 4px; }
.vitoria__btn {
  padding: 10px 24px;
  border: 0;
  border-radius: 8px;
  background: var(--ok);
  color: #06210f;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.15s ease, filter 0.15s ease;
}
.vitoria__btn:hover { transform: translateY(-2px); filter: brightness(1.08); }
.vitoria__btn--sec { background: transparent; border: 1px solid var(--destaque); color: var(--destaque); }
</style>
