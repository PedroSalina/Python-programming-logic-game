import { configuracoes } from './configuracoes';

let contexto = null;

const obterContexto = () => {
  if (!contexto) {
    const Construtor = window.AudioContext || window.webkitAudioContext;
    if (!Construtor) return null;
    contexto = new Construtor();
  }
  if (contexto.state === 'suspended') contexto.resume();
  return contexto;
};

const nota = (frequencia, inicio, duracao, { tipo = 'sine', volume = 0.1, ate = null } = {}) => {
  const ctx = obterContexto();
  if (!ctx) return;
  const t = ctx.currentTime + inicio;
  const oscilador = ctx.createOscillator();
  const ganho = ctx.createGain();
  oscilador.type = tipo;
  oscilador.frequency.setValueAtTime(frequencia, t);
  if (ate) oscilador.frequency.exponentialRampToValueAtTime(ate, t + duracao);
  ganho.gain.setValueAtTime(0.0001, t);
  ganho.gain.exponentialRampToValueAtTime(volume, t + 0.01);
  ganho.gain.exponentialRampToValueAtTime(0.0001, t + duracao);
  oscilador.connect(ganho).connect(ctx.destination);
  oscilador.start(t);
  oscilador.stop(t + duracao + 0.02);
};

const sons = {
  clique: () => nota(540, 0, 0.05, { tipo: 'triangle', volume: 0.07 }),
  pegar: () => nota(420, 0, 0.05, { tipo: 'triangle', volume: 0.06 }),
  encaixe: () => nota(300, 0, 0.09, { tipo: 'square', volume: 0.05, ate: 460 }),
  sucesso: () => {
    nota(523, 0, 0.12, { tipo: 'triangle', volume: 0.09 });
    nota(659, 0.09, 0.12, { tipo: 'triangle', volume: 0.09 });
    nota(784, 0.18, 0.2, { tipo: 'triangle', volume: 0.09 });
  },
  erro: () => nota(220, 0, 0.18, { tipo: 'sawtooth', volume: 0.06, ate: 140 }),
  tecla: () => nota(700 + Math.random() * 500, 0, 0.03, { tipo: 'square', volume: 0.025 }),
  email: () => {
    nota(880, 0, 0.1, { volume: 0.07 });
    nota(1175, 0.12, 0.18, { volume: 0.07 });
  },
  vitoria: () => [523, 659, 784, 1047].forEach((f, i) => nota(f, i * 0.11, 0.22, { tipo: 'triangle', volume: 0.09 })),
  alerta: () => nota(660, 0, 0.08, { tipo: 'square', volume: 0.045 })
};

export const audio = {
  tocar(nome) {
    if (!configuracoes.som) return;
    const som = sons[nome];
    if (som) som();
  }
};
