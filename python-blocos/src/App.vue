<script setup>
import { reactive, computed, watch, onUnmounted } from 'vue';
import { EventBus } from './EventBus';
import { NIVEIS, NIVEIS_NORMAIS, NIVEIS_HARD, TOTAL_NORMAIS } from './game/levels';
import { useCronometro } from './composables/useCronometro';
import { recordes } from './services/recordes';
import { progresso } from './services/progresso';
import { configuracoes } from './services/configuracoes';
import { audio } from './services/audio';
import { ehDispositivoDeToque } from './utils/dispositivo';
import PhaserGame from './components/PhaserGame.vue';
import GameHud from './components/GameHud.vue';
import LegendaPecas from './components/LegendaPecas.vue';
import EmailPedido from './components/EmailPedido.vue';
import VictoryOverlay from './components/VictoryOverlay.vue';
import RankingModal from './components/RankingModal.vue';
import TutorialModal from './components/TutorialModal.vue';
import ConfigModal from './components/ConfigModal.vue';
import ConfirmModal from './components/ConfirmModal.vue';
import TelaInicial from './components/TelaInicial.vue';

const toque = ehDispositivoDeToque();
const cron = useCronometro();
const idsFases = NIVEIS.map(n => n.id);
const desafios = NIVEIS_HARD.map(n => ({ id: n.id, titulo: n.titulo, limite: n.tempoLimite }));

const estado = reactive({
  id: '',
  empresa: '',
  gerente: '',
  titulo: '',
  resumo: '',
  cliente: {},
  email: {},
  respostas: [],
  nivel: 0,
  totalNiveis: NIVEIS.length,
  totalNormais: TOTAL_NORMAIS,
  hard: false,
  tempoLimite: 0,
  totalLinhas: 0,
  linha: 0,
  dica: '',
  mensagem: '',
  modo: 'blocos',
  digitado: 0,
  digitacaoAuto: false,
  saida: '',
  agradecimento: '',
  aprendizado: '',
  resultado: null,
  concluidos: progresso.listar(),
  telaInicial: true,
  emailAberto: false,
  rankingAberto: false,
  configAberta: false,
  tutorialAberto: false,
  confirmacao: null,
  versaoRecordes: 0,
  faseSolicitada: null,
  cronometroIniciado: false,
  pausaPorTela: false
});

const desbloqueada = (indice) => {
  if (configuracoes.modoLivre) return true;
  const concluidos = estado.concluidos;
  if (NIVEIS[indice].hard) {
    const normaisCompletos = NIVEIS_NORMAIS.every(n => concluidos.includes(n.id));
    return normaisCompletos && (indice === TOTAL_NORMAIS || concluidos.includes(NIVEIS[indice - 1].id));
  }
  return indice === 0 || concluidos.includes(NIVEIS[indice - 1].id);
};

const trancadas = computed(() => NIVEIS.map((_, indice) => !desbloqueada(indice)));
const temProgresso = computed(() => estado.concluidos.length > 0);
const normaisConcluidos = computed(() => NIVEIS_NORMAIS.filter(n => estado.concluidos.includes(n.id)).length);

const limiteMs = computed(() => estado.tempoLimite * 1000);
const restanteMs = computed(() => limiteMs.value - cron.estado.decorrido);
const telaAberta = computed(
  () => estado.telaInicial || estado.emailAberto || estado.rankingAberto || estado.configAberta || estado.tutorialAberto
);
const modalSobreEmail = computed(
  () => estado.telaInicial || estado.rankingAberto || estado.configAberta || estado.tutorialAberto || Boolean(estado.confirmacao)
);
const numeroNoGrupo = computed(() => (estado.hard ? estado.nivel - estado.totalNormais + 1 : estado.nivel + 1));
const totalNoGrupo = computed(() => (estado.hard ? estado.totalNiveis - estado.totalNormais : estado.totalNormais));
const ultimoDoGrupo = computed(() => numeroNoGrupo.value === totalNoGrupo.value);
const linhasConcluidas = computed(() => (estado.modo === 'blocos' ? estado.linha : estado.totalLinhas));
const pausaVisivel = computed(
  () => estado.hard && estado.modo === 'blocos' && cron.estado.pausado && !estado.pausaPorTela
);
const remetente = computed(() =>
  estado.cliente.contato ? `${estado.cliente.contato} (${estado.cliente.empresa})` : ''
);

const rotuloPrimario = computed(() => {
  if (!ultimoDoGrupo.value) return estado.hard ? 'Próximo desafio (Enter)' : 'Próximo serviço (Enter)';
  return estado.hard ? 'Voltar aos serviços (Enter)' : 'Recomeçar (Enter)';
});
const rotuloSecundario = computed(() => {
  if (!ultimoDoGrupo.value) return '';
  return estado.hard ? 'Ver ranking' : 'Teste seu conhecimento (Hard)';
});

const irPara = (nivel) => {
  if (!desbloqueada(nivel)) return;
  estado.faseSolicitada = nivel;
  EventBus.emit('ui:proxima-fase', nivel);
};

const proximaPendente = () => {
  const pendente = NIVEIS.findIndex(n => !estado.concluidos.includes(n.id));
  return pendente === -1 ? 0 : pendente;
};

const jogar = () => {
  estado.telaInicial = false;
  if (!progresso.tutorialVisto()) estado.tutorialAberto = true;
  irPara(proximaPendente());
};

const validar = () => EventBus.emit('ui:validar');
const limpar = () => EventBus.emit('ui:limpar');
const digitarAutomatico = () => EventBus.emit('ui:digitar-auto');
const continuar = () => irPara(ultimoDoGrupo.value ? 0 : estado.nivel + 1);
const acaoSecundaria = () => {
  if (estado.hard) estado.rankingAberto = true;
  else irPara(estado.totalNormais);
};

const alternarPausa = () => {
  if (!estado.hard || !cron.estado.rodando) return;
  if (cron.estado.pausado) cron.retomar();
  else cron.pausar();
};

const fecharTutorial = () => {
  progresso.marcarTutorialVisto();
  estado.tutorialAberto = false;
};

const abrirTutorialDaConfig = () => {
  estado.configAberta = false;
  estado.tutorialAberto = true;
};

const pedirLimparRecordes = () => {
  estado.confirmacao = {
    titulo: 'Limpar recordes?',
    texto: 'Todos os melhores tempos salvos neste navegador serão apagados.',
    rotulo: 'Limpar',
    acao: async () => {
      await recordes.limpar();
      estado.versaoRecordes += 1;
    }
  };
};

const pedirApagarProgresso = () => {
  estado.confirmacao = {
    titulo: 'Apagar progresso?',
    texto: 'As fases concluídas e os recordes deste navegador serão apagados. As configurações são mantidas.',
    rotulo: 'Apagar',
    acao: async () => {
      progresso.limpar();
      await recordes.limpar();
      estado.concluidos = [];
      estado.versaoRecordes += 1;
      estado.configAberta = false;
      irPara(0);
    }
  };
};

const confirmar = async () => {
  const { acao } = estado.confirmacao;
  estado.confirmacao = null;
  await acao();
};

const concluirFase = async () => {
  progresso.marcar(estado.id);
  estado.concluidos = progresso.listar();
  if (!estado.hard) return;

  const tempoMs = Math.round(cron.parar());
  const noPrazo = tempoMs <= limiteMs.value;
  const registro = await recordes.registrar(estado.id, { tempoMs, noPrazo });
  estado.resultado = {
    tempoMs,
    noPrazo,
    atrasoMs: Math.max(0, tempoMs - limiteMs.value),
    recorde: registro.recorde
  };
};

const aoFaseIniciada = (d) => {
  if (estado.faseSolicitada !== null && estado.faseSolicitada !== d.nivel) {
    EventBus.emit('ui:proxima-fase', estado.faseSolicitada);
    return;
  }
  estado.faseSolicitada = null;

  cron.zerar();
  Object.assign(estado, {
    id: d.id,
    empresa: d.empresa,
    gerente: d.gerente,
    titulo: d.titulo,
    resumo: d.resumo,
    cliente: d.cliente,
    email: d.email,
    respostas: d.respostas || [],
    nivel: d.nivel,
    totalNiveis: d.totalNiveis,
    totalNormais: d.totalNormais,
    hard: d.hard,
    tempoLimite: d.tempoLimite,
    totalLinhas: d.totalLinhas,
    linha: 0,
    dica: '',
    mensagem: '',
    modo: 'blocos',
    digitado: 0,
    digitacaoAuto: false,
    saida: '',
    agradecimento: '',
    aprendizado: '',
    resultado: null,
    cronometroIniciado: false,
    pausaPorTela: false,
    emailAberto: true
  });
  if (!estado.telaInicial) audio.tocar('email');
};
const aoLinhaIniciada = (d) => {
  estado.linha = d.indice;
  estado.dica = d.dica || '';
  estado.mensagem = '';
};
const aoMensagem = (texto) => {
  estado.mensagem = texto;
};
const aoModo = (modo) => {
  estado.modo = modo;
  if (modo === 'transicao') concluirFase();
};
const aoProgresso = ({ atual, total }) => {
  estado.digitado = Math.round((atual / total) * 100);
};
const aoDigitacaoAuto = (ativa) => {
  estado.digitacaoAuto = ativa;
};
const aoVitoria = (d) => {
  estado.saida = d.saida;
  estado.agradecimento = d.agradecimento;
  estado.aprendizado = d.aprendizado;
  estado.modo = 'vitoria';
  audio.tocar('vitoria');
};

watch(telaAberta, (aberta) => {
  if (!estado.hard || estado.modo !== 'blocos') return;

  if (aberta) {
    if (cron.estado.rodando && !cron.estado.pausado) {
      cron.pausar();
      estado.pausaPorTela = true;
    }
    return;
  }

  if (!estado.cronometroIniciado) {
    cron.iniciar();
    estado.cronometroIniciado = true;
    return;
  }

  if (estado.pausaPorTela) {
    cron.retomar();
    estado.pausaPorTela = false;
  }
});

const aoTecla = (e) => {
  const livre = estado.modo === 'blocos' && !telaAberta.value && !estado.confirmacao && !cron.estado.pausado;
  if (!livre) return;

  if (e.key === 'Enter' && !e.repeat) {
    e.preventDefault();
    validar();
  } else if (e.key === 'Backspace') {
    e.preventDefault();
    EventBus.emit('ui:desfazer');
  }
};

EventBus.on('fase:iniciada', aoFaseIniciada);
EventBus.on('linha:iniciada', aoLinhaIniciada);
EventBus.on('linha:mensagem', aoMensagem);
EventBus.on('fase:modo', aoModo);
EventBus.on('digitacao:progresso', aoProgresso);
EventBus.on('digitacao:auto', aoDigitacaoAuto);
EventBus.on('fase:vitoria', aoVitoria);
window.addEventListener('keydown', aoTecla);

onUnmounted(() => {
  EventBus.off('fase:iniciada', aoFaseIniciada);
  EventBus.off('linha:iniciada', aoLinhaIniciada);
  EventBus.off('linha:mensagem', aoMensagem);
  EventBus.off('fase:modo', aoModo);
  EventBus.off('digitacao:progresso', aoProgresso);
  EventBus.off('digitacao:auto', aoDigitacaoAuto);
  EventBus.off('fase:vitoria', aoVitoria);
  window.removeEventListener('keydown', aoTecla);
});
</script>

<template>
  <main class="app" :class="{ 'app--hard': estado.hard }">
    <p class="aviso-giro">Gire o celular para o modo paisagem para jogar melhor.</p>

    <div class="topo">
      <GameHud
        :empresa="estado.empresa"
        :titulo="estado.titulo"
        :resumo="estado.resumo"
        :cliente="estado.cliente"
        :dica="estado.dica"
        :respostas="estado.respostas"
        :linha="estado.linha"
        :mensagem="estado.mensagem"
        :modo="estado.modo"
        :concluidas="linhasConcluidas"
        :total="estado.totalLinhas"
        :nivel="estado.nivel"
        :total-niveis="estado.totalNiveis"
        :total-normais="estado.totalNormais"
        :hard="estado.hard"
        :ids-fases="idsFases"
        :concluidos="estado.concluidos"
        :trancadas="trancadas"
        :restante-ms="restanteMs"
        :cron-rodando="cron.estado.rodando"
        :pausado="cron.estado.pausado"
        :toque="toque"
        @validar="validar"
        @limpar="limpar"
        @irpara="irPara"
        @verpedido="estado.emailAberto = true"
        @ranking="estado.rankingAberto = true"
        @tutorial="estado.tutorialAberto = true"
        @config="estado.configAberta = true"
        @inicio="estado.telaInicial = true"
        @pausa="alternarPausa"
      />
    </div>

    <div class="palco">
      <PhaserGame />

      <div v-if="estado.modo === 'digitando'" class="digitacao">
        <p class="digitacao__texto">
          {{ estado.digitacaoAuto ? 'Escrevendo o código...' : 'Aperte qualquer tecla para programar!' }}
          ({{ estado.digitado }}%)
        </p>
        <button v-if="!estado.digitacaoAuto" class="digitacao__auto" @click="digitarAutomatico">
          Digitar automaticamente
        </button>
      </div>

      <Transition name="fade">
        <div v-if="pausaVisivel" class="pausa">
          <p class="pausa__titulo">Tempo pausado</p>
          <p class="pausa__texto">O jogo fica escondido enquanto o cronômetro está parado.</p>
          <button class="pausa__btn" @click="alternarPausa">Continuar</button>
        </div>
      </Transition>

      <Transition name="fade">
        <VictoryOverlay
          v-if="estado.modo === 'vitoria'"
          :hard="estado.hard"
          :remetente="remetente"
          :saida="estado.saida"
          :agradecimento="estado.agradecimento"
          :aprendizado="estado.aprendizado"
          :resultado="estado.resultado"
          :rotulo-primario="rotuloPrimario"
          :rotulo-secundario="rotuloSecundario"
          @continuar="continuar"
          @secundaria="acaoSecundaria"
        />
      </Transition>
    </div>

    <div class="lateral">
      <LegendaPecas />
    </div>

    <Transition name="fade">
      <EmailPedido
        v-if="estado.emailAberto"
        :empresa="estado.empresa"
        :gerente="estado.gerente"
        :cliente="estado.cliente"
        :email="estado.email"
        :numero="numeroNoGrupo"
        :total="totalNoGrupo"
        :hard="estado.hard"
        :tempo-limite="estado.tempoLimite"
        :ativo="!modalSobreEmail"
        @comecar="estado.emailAberto = false"
      />
    </Transition>

    <Transition name="fade">
      <TelaInicial
        v-if="estado.telaInicial"
        :ativo="!estado.rankingAberto && !estado.configAberta && !estado.tutorialAberto && !estado.confirmacao"
        :tem-progresso="temProgresso"
        :concluidos="normaisConcluidos"
        :total="estado.totalNormais"
        @jogar="jogar"
        @ranking="estado.rankingAberto = true"
        @tutorial="estado.tutorialAberto = true"
        @config="estado.configAberta = true"
      />
    </Transition>

    <Transition name="fade">
      <RankingModal
        v-if="estado.rankingAberto"
        :key="estado.versaoRecordes"
        :desafios="desafios"
        @fechar="estado.rankingAberto = false"
        @limpar="pedirLimparRecordes"
      />
    </Transition>

    <Transition name="fade">
      <ConfigModal
        v-if="estado.configAberta"
        @fechar="estado.configAberta = false"
        @tutorial="abrirTutorialDaConfig"
        @apagar="pedirApagarProgresso"
      />
    </Transition>

    <Transition name="fade">
      <TutorialModal v-if="estado.tutorialAberto" :toque="toque" @fechar="fecharTutorial" />
    </Transition>

    <Transition name="fade">
      <ConfirmModal
        v-if="estado.confirmacao"
        :titulo="estado.confirmacao.titulo"
        :texto="estado.confirmacao.texto"
        :rotulo="estado.confirmacao.rotulo"
        @confirmar="confirmar"
        @cancelar="estado.confirmacao = null"
      />
    </Transition>
  </main>
</template>

<style scoped>
.app {
  display: grid;
  grid-template-columns: minmax(0, 928px) 140px;
  justify-content: center;
  column-gap: 14px;
  align-items: start;
  max-width: 1180px;
  margin: 0 auto;
  padding: 16px;
}
.app--hard { --destaque: #ff6b6b; }

.aviso-giro {
  display: none;
  grid-column: 1 / -1;
  margin: 0 0 12px;
  padding: 8px 12px;
  background: #2a2412;
  border-radius: 6px;
  color: #f3e3b3;
  font-size: 0.85rem;
  text-align: center;
}

.topo { grid-column: 1; grid-row: 2; }
.palco { grid-column: 1; grid-row: 3; position: relative; }
.lateral { grid-column: 2; grid-row: 3; }

.digitacao {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
}
.digitacao__texto { margin: 0; color: var(--texto-suave); font-family: var(--fonte-codigo); }
.digitacao__auto {
  padding: 6px 14px;
  border: 1px solid var(--ok);
  border-radius: 8px;
  background: transparent;
  color: var(--ok);
  font-weight: 700;
  cursor: pointer;
}

.pausa {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #0b0f14;
  border: 1px solid #5a2a2f;
  border-radius: 10px;
}
.pausa__titulo { margin: 0; font-size: 1.8rem; font-weight: 700; color: var(--destaque); }
.pausa__texto { margin: 0 0 8px; color: var(--texto-suave); }
.pausa__btn {
  padding: 10px 26px;
  border: 0;
  border-radius: 8px;
  background: var(--ok);
  color: #06210f;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
}

@media (max-width: 900px) {
  .app { grid-template-columns: minmax(0, 1fr); }
  .topo, .palco { grid-column: 1; }
  .lateral { grid-column: 1; grid-row: 4; margin-top: 8px; }
}

@media (hover: none) and (pointer: coarse) and (orientation: portrait) {
  .aviso-giro { display: block; grid-row: 1; }
}
</style>
