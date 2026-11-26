<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
import { formatarDuracao } from '../utils/tempo';
import { animar } from '../utils/movimento';

const props = defineProps({
  empresa: { type: String, default: '' },
  gerente: { type: String, default: '' },
  cliente: { type: Object, default: () => ({}) },
  email: { type: Object, default: () => ({}) },
  numero: { type: Number, default: 1 },
  total: { type: Number, default: 1 },
  hard: { type: Boolean, default: false },
  tempoLimite: { type: Number, default: 0 },
  ativo: { type: Boolean, default: true }
});
const emit = defineEmits(['comecar']);

const janela = ref(null);

const iniciais = computed(() =>
  (props.cliente.contato || '?').split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
);
const contador = computed(() =>
  `${props.hard ? 'Desafio' : 'Serviço'} ${props.numero} de ${props.total}`
);
const limiteTexto = computed(() => formatarDuracao(props.tempoLimite * 1000));

let enviado = false;
const comecar = () => {
  if (enviado) return;
  enviado = true;
  emit('comecar');
};
const aoTecla = (e) => {
  if (!props.ativo || e.key !== 'Enter' || e.repeat) return;
  e.preventDefault();
  comecar();
};

onMounted(() => {
  window.addEventListener('keydown', aoTecla);

  const raiz = janela.value;
  const itens = [...raiz.querySelectorAll(
    '.mail__hard, .mail__nota, .mail__assunto, .mail__remetente, .mail__texto > p, .mail__pedidos li, .mail__assinatura'
  )];
  itens.forEach((el) => { el.style.opacity = 0; });

  animar(raiz, { opacity: [0, 1], y: [18, 0], scale: [0.97, 1], duration: 380, ease: 'outQuad' });
  animar(itens, {
    opacity: [0, 1],
    y: [10, 0],
    delay: (el, i) => 180 + i * 70,
    duration: 420,
    ease: 'outQuad'
  });
  animar(raiz.querySelector('.mail__avatar'), { scale: [0, 1], delay: 200, duration: 500, ease: 'outBack' });
});

onBeforeUnmount(() => window.removeEventListener('keydown', aoTecla));
</script>

<template>
  <div class="mail" role="dialog" aria-modal="true" aria-label="Pedido de serviço por e-mail">
    <article ref="janela" class="mail__janela">
      <header class="mail__barra">
        <span class="mail__pontos" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="mail__app">Caixa de entrada · {{ empresa }}</span>
        <span class="mail__contador">{{ contador }}</span>
      </header>

      <div class="mail__corpo">
        <aside v-if="hard" class="mail__hard">
          <span class="mail__hard-titulo">Teste seu conhecimento · Nível hard</span>
          Tempo sugerido: {{ limiteTexto }}. O cronômetro começa quando você aceitar o pedido e você pode pausar quando quiser.
          Se o tempo acabar, não há game over: o desafio apenas é marcado como concluído com atraso.
        </aside>

        <aside v-if="email.notaGerente" class="mail__nota">
          <span class="mail__nota-titulo">Nota do gerente · {{ gerente }}</span>
          {{ email.notaGerente }}
        </aside>

        <h2 class="mail__assunto">{{ email.assunto }}</h2>

        <div class="mail__remetente">
          <div class="mail__avatar" :style="{ background: cliente.cor }" aria-hidden="true">{{ iniciais }}</div>
          <div class="mail__meta">
            <div>
              <strong>{{ cliente.contato }}</strong>
              <span class="mail__empresa"> · {{ cliente.empresa }} ({{ cliente.setor }})</span>
            </div>
            <div class="mail__para">
              Para: Estagiário(a)<template v-if="!email.interno"> · Cc: {{ gerente }}</template>
            </div>
          </div>
          <time class="mail__hora">{{ email.hora }}</time>
        </div>

        <div class="mail__texto">
          <p v-for="(p, i) in email.paragrafos" :key="i">{{ p }}</p>

          <div class="mail__pedidos">
            <strong>O que precisa ser feito:</strong>
            <ol>
              <li v-for="(item, i) in email.pedidos" :key="i">{{ item }}</li>
            </ol>
          </div>

          <p class="mail__assinatura">{{ email.assinatura }}</p>
        </div>
      </div>

      <footer class="mail__rodape">
        <button class="mail__btn" autofocus @click="comecar">
          {{ hard ? 'Aceitar pedido e iniciar o cronômetro' : 'Aceitar pedido e começar a codar' }}
        </button>
        <span class="mail__atalho">ou aperte Enter</span>
      </footer>
    </article>
  </div>
</template>

<style scoped>
.mail {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(5, 8, 12, 0.88);
  backdrop-filter: blur(4px);
}
.mail__janela {
  display: flex;
  flex-direction: column;
  width: min(720px, 100%);
  max-height: 94vh;
  background: var(--painel);
  border: 1px solid #263445;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
}

.mail__barra {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: #161b22;
  border-bottom: 1px solid #263445;
  font-size: 0.8rem;
  color: var(--texto-suave);
}
.mail__pontos { display: flex; gap: 6px; }
.mail__pontos i { width: 11px; height: 11px; border-radius: 50%; background: #ff5f56; }
.mail__pontos i:nth-child(2) { background: #ffbd2e; }
.mail__pontos i:nth-child(3) { background: #27c93f; }
.mail__app { flex: 1; text-align: center; }
.mail__contador { padding: 2px 10px; border-radius: 999px; background: #1b2a3a; color: var(--destaque); font-weight: 700; }

.mail__corpo { padding: 20px 24px 8px; overflow-y: auto; }

.mail__hard {
  margin-bottom: 12px;
  padding: 10px 14px;
  background: #2a1214;
  border-left: 4px solid #ff6b6b;
  border-radius: 6px;
  font-size: 0.9rem;
  line-height: 1.45;
  color: #ffd0d0;
}
.mail__hard-titulo {
  display: block;
  margin-bottom: 2px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #ff6b6b;
}

.mail__nota {
  margin-bottom: 16px;
  padding: 10px 14px;
  background: #2a2412;
  border-left: 4px solid #ffd166;
  border-radius: 6px;
  font-size: 0.9rem;
  line-height: 1.45;
  color: #f3e3b3;
}
.mail__nota-titulo {
  display: block;
  margin-bottom: 2px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #ffd166;
}

.mail__assunto { margin: 0 0 14px; font-size: 1.3rem; line-height: 1.25; }

.mail__remetente {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 14px;
  margin-bottom: 14px;
  border-bottom: 1px solid #1f2a37;
}
.mail__avatar {
  flex: none;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  color: #0b0f14;
  font-weight: 800;
}
.mail__meta { flex: 1; min-width: 0; font-size: 0.95rem; }
.mail__empresa { color: var(--texto-suave); }
.mail__para { margin-top: 2px; font-size: 0.8rem; color: var(--texto-suave); }
.mail__hora { flex: none; font-size: 0.8rem; color: var(--texto-suave); }

.mail__texto { line-height: 1.55; font-size: 0.98rem; }
.mail__texto p { margin: 0 0 12px; }

.mail__pedidos {
  margin: 16px 0;
  padding: 12px 16px;
  background: #14202e;
  border-left: 4px solid var(--destaque);
  border-radius: 6px;
}
.mail__pedidos ol { margin: 8px 0 0; padding-left: 22px; }
.mail__pedidos li { margin: 4px 0; }
.mail__pedidos li::marker { color: var(--destaque); font-weight: 700; }

.mail__assinatura { margin-top: 8px; color: var(--texto-suave); font-style: italic; }

.mail__rodape {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 14px;
  padding: 14px 24px 18px;
  border-top: 1px solid #1f2a37;
}
.mail__btn {
  padding: 12px 26px;
  border: 0;
  border-radius: 10px;
  background: var(--ok);
  color: #06210f;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
}
.mail__btn:hover { filter: brightness(1.08); }
.mail__atalho { font-size: 0.8rem; color: var(--texto-suave); }

</style>
