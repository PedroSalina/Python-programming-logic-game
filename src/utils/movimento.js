import { animate } from 'animejs';
import { configuracoes } from '../services/configuracoes';

export const movimentoReduzido = () => configuracoes.reduzirMovimento;

export const animar = (alvos, parametros) =>
  animate(alvos, movimentoReduzido() ? { ...parametros, duration: 1, delay: 0, loop: false } : parametros);

export const contar = (ate, duracao, aoAtualizar, atraso = 0) => {
  const marcador = { valor: 0 };
  return animar(marcador, {
    valor: ate,
    duration: duracao,
    delay: atraso,
    ease: 'outQuad',
    onUpdate: () => aoAtualizar(marcador.valor),
    onComplete: () => aoAtualizar(ate)
  });
};
