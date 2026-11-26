<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { animar } from '../utils/movimento';

defineProps({
  toque: { type: Boolean, default: false }
});
const emit = defineEmits(['fechar']);

const raiz = ref(null);

const passos = [
  {
    titulo: 'Leia o pedido',
    texto: 'Cada serviço começa com um e-mail de um cliente. Leia o que precisa ser feito e aceite para começar. O botão Ver pedido reabre o e-mail quando quiser.'
  },
  {
    titulo: 'Monte a linha',
    texto: 'Clique (ou toque) nas peças, ou arraste-as, para montar a linha de código na ordem certa. A cor mostra o tipo da peça (variável, valor, operador...), e a legenda fica ao lado do jogo. Clicar numa peça da linha a devolve para baixo, e Backspace tira a última peça.'
  },
  {
    titulo: 'Valide',
    texto: 'Clique em Validar para conferir a linha. Se estiver certa, ela congela e surge a próxima linha vazia.'
  },
  {
    titulo: 'Precisa de ajuda?',
    texto: 'O botão Dica explica o que fazer na linha atual. O botão Resposta mostra o código completo do serviço (ele não aparece nos desafios do nível hard).'
  },
  {
    titulo: 'Escreva o código',
    texto: 'Com todas as linhas certas, o código vira um editor de texto e é digitado na tela. No computador, aperte qualquer tecla; no celular, ele se escreve sozinho.'
  },
  {
    titulo: 'Teste seu conhecimento (opcional)',
    texto: 'Na aba vermelha ficam 3 desafios mais difíceis, com cronômetro. Você pode pausar quando quiser, e estourar o tempo não é game over: o desafio só é marcado como concluído com atraso. Seus melhores tempos aparecem na aba Ranking.'
  }
];

const aoTecla = (e) => {
  if ((e.key === 'Enter' || e.key === 'Escape') && !e.repeat) {
    e.preventDefault();
    emit('fechar');
  }
};

onMounted(() => {
  window.addEventListener('keydown', aoTecla);
  const passosEl = [...raiz.value.querySelectorAll('.tut__passo')];
  passosEl.forEach((el) => { el.style.opacity = 0; });
  animar(raiz.value, { opacity: [0, 1], y: [16, 0], scale: [0.97, 1], duration: 320, ease: 'outQuad' });
  animar(passosEl, { opacity: [0, 1], x: [-14, 0], delay: (el, i) => 120 + i * 70, duration: 380, ease: 'outQuad' });
});

onBeforeUnmount(() => window.removeEventListener('keydown', aoTecla));
</script>

<template>
  <div class="tut" role="dialog" aria-modal="true" aria-label="Como jogar">
    <section ref="raiz" class="tut__janela">
      <h2 class="tut__titulo">Como jogar</h2>

      <ol class="tut__lista">
        <li v-for="(passo, i) in passos" :key="i" class="tut__passo">
          <span class="tut__numero">{{ i + 1 }}</span>
          <div>
            <strong>{{ passo.titulo }}</strong>
            <p>{{ passo.texto }}</p>
          </div>
        </li>
      </ol>

      <p v-if="toque" class="tut__dica">No celular, o jogo funciona melhor com a tela na horizontal.</p>

      <button class="tut__btn" autofocus @click="emit('fechar')">Entendi</button>
    </section>
  </div>
</template>

<style scoped>
.tut {
  position: fixed;
  inset: 0;
  z-index: 70;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(5, 8, 12, 0.9);
  backdrop-filter: blur(4px);
}
.tut__janela {
  display: flex;
  flex-direction: column;
  width: min(640px, 100%);
  max-height: 92vh;
  padding: 20px 24px;
  background: var(--painel);
  border: 1px solid #263445;
  border-radius: 14px;
  overflow-y: auto;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
}
.tut__titulo { margin: 0 0 12px; font-size: 1.3rem; }
.tut__lista { display: flex; flex-direction: column; gap: 12px; margin: 0; padding: 0; list-style: none; }
.tut__passo { display: flex; gap: 12px; }
.tut__passo p { margin: 2px 0 0; color: var(--texto-suave); font-size: 0.92rem; line-height: 1.45; }
.tut__numero {
  flex: none;
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--destaque);
  color: #06212b;
  font-size: 0.85rem;
  font-weight: 800;
}
.tut__dica { margin: 14px 0 0; padding: 8px 12px; background: #2a2412; border-radius: 6px; color: #f3e3b3; font-size: 0.88rem; }
.tut__btn {
  align-self: center;
  margin-top: 16px;
  padding: 10px 28px;
  border: 0;
  border-radius: 8px;
  background: var(--ok);
  color: #06210f;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
}
</style>
