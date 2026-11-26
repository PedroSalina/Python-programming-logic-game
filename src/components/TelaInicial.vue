<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { animate } from 'animejs';
import { animar, movimentoReduzido } from '../utils/movimento';
import { TIPOS, corCss } from '../game/tipos';
import Logo from './Logo.vue';

const props = defineProps({
  ativo: { type: Boolean, default: true },
  temProgresso: { type: Boolean, default: false },
  concluidos: { type: Number, default: 0 },
  total: { type: Number, default: 0 }
});
const emit = defineEmits(['jogar', 'ranking', 'tutorial', 'config']);

const raiz = ref(null);

const decoracao = [
  { texto: 'if', tipo: 'ctrl', x: 8, y: 16 },
  { texto: 'print(', tipo: 'func', x: 78, y: 12 },
  { texto: '=', tipo: 'op', x: 14, y: 72 },
  { texto: '"sol"', tipo: 'valor', x: 74, y: 74 },
  { texto: 'while', tipo: 'ctrl', x: 4, y: 44 },
  { texto: 'total', tipo: 'var', x: 86, y: 46 },
  { texto: ':', tipo: 'pont', x: 58, y: 88 },
  { texto: 'range(', tipo: 'func', x: 28, y: 90 }
];

const aoTecla = (e) => {
  if (!props.ativo || e.key !== 'Enter' || e.repeat) return;
  e.preventDefault();
  emit('jogar');
};

onMounted(() => {
  window.addEventListener('keydown', aoTecla);

  const itens = [...raiz.value.querySelectorAll('.ini__item')];
  const pecas = [...raiz.value.querySelectorAll('.ini__peca')];
  itens.forEach((el) => { el.style.opacity = 0; });
  pecas.forEach((el) => { el.style.opacity = 0; });

  animar(itens, {
    opacity: [0, 1],
    y: [18, 0],
    delay: (el, i) => 120 * i,
    duration: 560,
    ease: 'outQuad'
  });
  animar(pecas, {
    opacity: [0, 0.85],
    scale: [0, 1],
    delay: (el, i) => 200 + i * 90,
    duration: 600,
    ease: 'outBack'
  });

  if (movimentoReduzido()) return;
  pecas.forEach((el, i) => {
    animate(el, {
      y: [0, -14],
      duration: 2600 + i * 320,
      ease: 'inOutSine',
      loop: true,
      alternate: true
    });
  });
});

onBeforeUnmount(() => window.removeEventListener('keydown', aoTecla));
</script>

<template>
  <div ref="raiz" class="ini" role="dialog" aria-label="Tela inicial">
    <span
      v-for="(p, i) in decoracao"
      :key="i"
      class="ini__peca"
      :style="{ left: p.x + '%', top: p.y + '%', background: corCss(TIPOS[p.tipo].cor) }"
    >{{ p.texto }}</span>

    <div class="ini__conteudo">
      <Logo :tamanho="84" class="ini__item" />
      <h1 class="ini__titulo ini__item">Estágio na Logicompany</h1>
      <p class="ini__sub ini__item">Aprenda lógica de programação montando código, um serviço de cada vez.</p>

      <button class="ini__jogar ini__item" autofocus @click="emit('jogar')">
        {{ temProgresso ? 'Continuar' : 'Começar' }}
      </button>
      <p v-if="temProgresso" class="ini__progresso ini__item">{{ concluidos }} de {{ total }} serviços concluídos</p>

      <nav class="ini__links ini__item">
        <button @click="emit('ranking')">Ranking</button>
        <button @click="emit('tutorial')">Como jogar</button>
        <button @click="emit('config')">Configurações</button>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.ini {
  position: fixed;
  inset: 0;
  z-index: 55;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: radial-gradient(ellipse at 50% 35%, #12233a 0%, var(--bg) 62%);
}

.ini__peca {
  position: absolute;
  padding: 7px 16px;
  border-radius: 8px;
  color: #0b0f14;
  font-family: var(--fonte-codigo);
  font-size: 0.95rem;
  font-weight: 700;
  pointer-events: none;
}
.ini__peca::after {
  content: '';
  position: absolute;
  right: -7px;
  top: 50%;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: inherit;
  transform: translateY(-50%);
}
.ini__peca::before {
  content: '';
  position: absolute;
  left: -7px;
  top: 50%;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #0d1624;
  transform: translateY(-50%);
}

.ini__conteudo {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 24px;
  text-align: center;
}
.ini__titulo { margin: 0; font-size: clamp(1.8rem, 5vw, 2.8rem); letter-spacing: -0.02em; }
.ini__sub { max-width: 460px; margin: 0; color: var(--texto-suave); line-height: 1.5; }

.ini__jogar {
  margin-top: 8px;
  padding: 14px 44px;
  border: 0;
  border-radius: 12px;
  background: var(--ok);
  color: #06210f;
  font-size: 1.15rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 8px 28px rgba(46, 204, 113, 0.3);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.ini__jogar:hover { transform: translateY(-2px); box-shadow: 0 12px 34px rgba(46, 204, 113, 0.4); }
.ini__progresso { margin: 0; color: var(--texto-suave); font-size: 0.9rem; }

.ini__links { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 8px; }
.ini__links button {
  padding: 8px 16px;
  border: 1px solid #2a3a4c;
  border-radius: 8px;
  background: transparent;
  color: var(--texto-suave);
  font-size: 0.9rem;
  cursor: pointer;
}
.ini__links button:hover { color: var(--texto); border-color: var(--texto-suave); }
</style>
