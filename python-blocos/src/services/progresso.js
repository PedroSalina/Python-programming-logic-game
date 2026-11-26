const CHAVE_FASES = 'logicompany:progresso:v1';
const CHAVE_TUTORIAL = 'logicompany:tutorial-visto';

const seguro = (acao, padrao) => {
  try {
    return acao();
  } catch {
    return padrao;
  }
};

const lerFases = () =>
  seguro(() => {
    const dados = JSON.parse(window.localStorage.getItem(CHAVE_FASES));
    return Array.isArray(dados) ? dados : [];
  }, []);

export const progresso = {
  listar: lerFases,

  marcar(id) {
    const atuais = lerFases();
    if (atuais.includes(id)) return;
    seguro(() => window.localStorage.setItem(CHAVE_FASES, JSON.stringify([...atuais, id])), undefined);
  },

  limpar() {
    seguro(() => window.localStorage.removeItem(CHAVE_FASES), undefined);
  },

  tutorialVisto() {
    return seguro(() => window.localStorage.getItem(CHAVE_TUTORIAL) === '1', false);
  },

  marcarTutorialVisto() {
    seguro(() => window.localStorage.setItem(CHAVE_TUTORIAL, '1'), undefined);
  }
};
