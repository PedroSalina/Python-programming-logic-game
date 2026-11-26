const CHAVE = 'logicompany:recordes:v1';
const MAXIMO_POR_FASE = 5;

const seguro = (acao, padrao) => {
  try {
    return acao();
  } catch {
    return padrao;
  }
};

const lerTodos = () =>
  seguro(() => JSON.parse(window.localStorage.getItem(CHAVE)) || {}, {});

const gravarTodos = (dados) =>
  seguro(() => window.localStorage.setItem(CHAVE, JSON.stringify(dados)), undefined);

export const recordes = {
  async registrar(faseId, { tempoMs, noPrazo }) {
    const todos = lerTodos();
    const entrada = { tempoMs, noPrazo, data: Date.now() };
    const lista = [...(todos[faseId] || []), entrada]
      .sort((a, b) => a.tempoMs - b.tempoMs)
      .slice(0, MAXIMO_POR_FASE);
    todos[faseId] = lista;
    gravarTodos(todos);
    const indice = lista.indexOf(entrada);
    return { posicao: indice === -1 ? null : indice + 1, recorde: indice === 0 };
  },

  async listar(faseId) {
    return lerTodos()[faseId] || [];
  },

  async listarTodos() {
    return lerTodos();
  },

  async limpar() {
    gravarTodos({});
  }
};
