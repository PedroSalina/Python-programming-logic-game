<script setup>
import { computed, ref, watch } from 'vue';
import { formatarRestante } from '../utils/tempo';
import { animar, movimentoReduzido } from '../utils/movimento';
import { audio } from '../services/audio';

const props = defineProps({
  restanteMs: { type: Number, default: 0 },
  pausado: { type: Boolean, default: false },
  rodando: { type: Boolean, default: false }
});
defineEmits(['alternar']);

const raiz = ref(null);

const estourou = computed(() => props.restanteMs < 0);
const alerta = computed(
  () => props.rodando && !props.pausado && props.restanteMs > 0 && props.restanteMs <= 15000 && !movimentoReduzido()
);
const texto = computed(() => formatarRestante(props.restanteMs));
const rotulo = computed(() => {
  if (estourou.value) return 'Tempo estourado';
  if (props.pausado) return 'Pausado';
  return 'Tempo restante';
});

watch(estourou, (valor) => {
  if (!valor || !props.rodando) return;
  audio.tocar('erro');
  if (movimentoReduzido() || !raiz.value) return;
  animar(raiz.value, {
    x: [{ to: -8 }, { to: 8 }, { to: -5 }, { to: 5 }, { to: 0 }],
    duration: 420,
    ease: 'outQuad'
  });
});

watch(
  () => Math.ceil(props.restanteMs / 1000),
  (segundos) => {
    if (props.rodando && !props.pausado && segundos > 0 && segundos <= 10) audio.tocar('alerta');
  }
);
</script>

<template>
  <div
    ref="raiz"
    class="cron"
    :class="{ 'cron--estourou': estourou, 'cron--pausado': pausado, 'cron--alerta': alerta }"
    role="timer"
  >
    <span class="cron__rotulo">{{ rotulo }}</span>
    <span class="cron__tempo">{{ texto }}</span>
    <button class="cron__btn" :disabled="!rodando" @click="$emit('alternar')">
      {{ pausado ? 'Continuar' : 'Pausar' }}
    </button>
  </div>
</template>

<style scoped>
.cron {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 6px 12px;
  background: #1c1416;
  border: 1px solid #5a2a2f;
  border-radius: 10px;
  transition: background 0.3s ease, border-color 0.3s ease;
}
.cron__rotulo { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--texto-suave); }
.cron__tempo { min-width: 4ch; font-family: var(--fonte-codigo); font-size: 1.4rem; font-weight: 700; color: var(--texto); }
.cron__btn {
  padding: 4px 12px;
  border: 1px solid #5a2a2f;
  border-radius: 6px;
  background: transparent;
  color: var(--texto);
  font-weight: 700;
  cursor: pointer;
}
.cron__btn:disabled { opacity: 0.4; cursor: not-allowed; }

.cron--pausado .cron__tempo { color: var(--texto-suave); }
.cron--alerta { animation: pulso 1s ease-in-out infinite; }
.cron--alerta .cron__tempo { color: #ffd166; }
.cron--estourou { background: #3a1216; border-color: var(--erro); }
.cron--estourou .cron__rotulo,
.cron--estourou .cron__tempo { color: var(--erro); }

@keyframes pulso {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255, 209, 102, 0); }
  50% { box-shadow: 0 0 0 5px rgba(255, 209, 102, 0.22); }
}
</style>
