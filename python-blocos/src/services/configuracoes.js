import { reactive, watch } from 'vue';

const CHAVE = 'logicompany:config:v1';

const seguro = (acao, padrao) => {
  try {
    return acao();
  } catch {
    return padrao;
  }
};

const salvo = seguro(() => JSON.parse(window.localStorage.getItem(CHAVE)), null);

export const configuracoes = reactive({
  som: true,
  modoLivre: false,
  reduzirMovimento: seguro(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, false),
  ...(salvo || {})
});

watch(
  configuracoes,
  (valor) => {
    seguro(() => window.localStorage.setItem(CHAVE, JSON.stringify(valor)), undefined);
  },
  { deep: true }
);
