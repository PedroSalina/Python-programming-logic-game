import Phaser from 'phaser';
import { EventBus } from '../../EventBus';
import { NIVEIS, TOTAL_NORMAIS, EMPRESA, GERENTE, linhaParaCodigo } from '../levels';
import { TIPOS } from '../tipos';
import { ehDispositivoDeToque } from '../../utils/dispositivo';
import { configuracoes } from '../../services/configuracoes';
import { audio } from '../../services/audio';
import {
  LARGURA, ALTURA, FONTE, LINHA_Y0, INDENT_PX, PECA_ALTURA, PECA_PAD, ENCAIXE_R,
  COR_DESTAQUE, COR_DESTAQUE_HARD
} from '../constants';

const ATRASO_AVISO_MS = 2500;
const INTERVALO_AUTO_MS = 55;
const SIMBOLOS = ['{ }', '( )', '=', ':', '+', '0', '1', 'if', 'for', '[ ]', '#'];

const calcularLayout = (quantidadeLinhas) => {
  const passo = quantidadeLinhas > 5 ? 50 : 54;
  return {
    passo,
    alturaSlot: passo - 6,
    paletaY: Math.max(340, LINHA_Y0 + quantidadeLinhas * passo + 30)
  };
};

export class GameplayScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameplayScene' });
  }

  init(data) {
    this.nivelAtual = (data && data.nivel) || 0;
    this.currentLineIndex = 0;
    this.isTypingMode = false;
    this.charIndex = 0;

    this.nivel = NIVEIS[this.nivelAtual];
    this.codigoCompleto = this.nivel.linhas.map(linhaParaCodigo).join('\n');
    this.layout = calcularLayout(this.nivel.linhas.length);
    this.toque = ehDispositivoDeToque();
    this.limiteClique = this.toque ? 14 : 8;
    this.movimentoReduzido = configuracoes.reduzirMovimento;
    this.reiniciando = false;

    this.blocosPaleta = [];
    this.blocosMontados = [];
    this.objetosDaFase = [];
    this.slotAtual = null;
    this.areaSlot = null;
    this.brilhoSlot = null;
    this.indicadorInsercao = null;
    this.emissor = null;
    this.txtIDE = null;

    this.digitacaoAutomatica = false;
    this.cursorVisivel = true;
    this.temporizadorAuto = null;
    this.temporizadorOcioso = null;
    this.temporizadorCursor = null;
    this.avisoDigitacao = null;
  }

  create() {
    this.cameras.main.setBackgroundColor('#0f1722');
    if (!this.movimentoReduzido) this.cameras.main.fadeIn(280, 15, 23, 34);

    this.criarTexturas();
    this.criarAmbiente();

    this.emissor = this.add.particles(0, 0, 'particula', {
      speed: { min: 70, max: 200 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.9, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 650,
      gravityY: 120,
      tint: [0x2ecc71, 0x6ee7a0, 0xffffff],
      blendMode: 'ADD',
      emitting: false
    }).setDepth(20);

    this.rotuloPaleta = this.add.text(40, this.layout.paletaY - 36, 'Blocos disponíveis:', {
      fontFamily: FONTE, fontSize: '16px', color: '#8b98a5'
    });

    this.configurarInputBlocos();
    this.registrarEventosUI();

    EventBus.emit('fase:iniciada', {
      id: this.nivel.id,
      titulo: this.nivel.titulo,
      nivel: this.nivelAtual,
      totalNiveis: NIVEIS.length,
      totalNormais: TOTAL_NORMAIS,
      hard: Boolean(this.nivel.hard),
      tempoLimite: this.nivel.tempoLimite || 0,
      totalLinhas: this.nivel.linhas.length,
      empresa: EMPRESA,
      gerente: GERENTE,
      resumo: this.nivel.resumo,
      cliente: this.nivel.cliente,
      email: this.nivel.email,
      respostas: this.nivel.linhas.map(l => ({
        codigo: linhaParaCodigo(l),
        pecas: l.blocos.map(b => b.texto)
      }))
    });
    EventBus.emit('fase:modo', 'blocos');

    this.iniciarLinha(0);
  }

  criarTexturas() {
    if (!this.textures.exists('particula')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0xffffff, 1);
      g.fillCircle(4, 4, 4);
      g.generateTexture('particula', 8, 8);
      g.destroy();
    }
    if (!this.textures.exists('scanline')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x000000, 1);
      g.fillRect(0, 0, 4, 2);
      g.generateTexture('scanline', 4, 4);
      g.destroy();
    }
  }

  criarAmbiente() {
    const quantidade = this.toque ? 8 : 16;
    for (let i = 0; i < quantidade; i++) {
      const x = Phaser.Math.Between(20, LARGURA - 20);
      const y = Phaser.Math.Between(40, ALTURA);
      const texto = this.add.text(x, y, Phaser.Utils.Array.GetRandom(SIMBOLOS), {
        fontFamily: FONTE,
        fontSize: `${Phaser.Math.Between(14, 28)}px`,
        color: '#4cc9f0'
      }).setAlpha(0.06).setDepth(-10);

      if (this.movimentoReduzido) continue;
      this.tweens.add({
        targets: texto,
        y: y - Phaser.Math.Between(60, 140),
        alpha: { from: 0.03, to: 0.09 },
        duration: Phaser.Math.Between(5000, 9000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  registrarEventosUI() {
    this.aoValidarUI = () => this.validarLinha();
    this.aoLimparUI = () => this.limparLinha();
    this.aoDesfazerUI = () => this.desfazerUltima();
    this.aoDigitarAutoUI = () => this.iniciarDigitacaoAutomatica();
    this.aoProximaFaseUI = (nivel) => {
      if (this.movimentoReduzido) {
        this.scene.restart({ nivel });
        return;
      }
      if (this.reiniciando) return;
      this.reiniciando = true;
      this.cameras.main.fadeOut(200, 15, 23, 34);
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        this.scene.restart({ nivel });
      });
    };

    EventBus.on('ui:validar', this.aoValidarUI);
    EventBus.on('ui:limpar', this.aoLimparUI);
    EventBus.on('ui:desfazer', this.aoDesfazerUI);
    EventBus.on('ui:digitar-auto', this.aoDigitarAutoUI);
    EventBus.on('ui:proxima-fase', this.aoProximaFaseUI);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      EventBus.off('ui:validar', this.aoValidarUI);
      EventBus.off('ui:limpar', this.aoLimparUI);
      EventBus.off('ui:desfazer', this.aoDesfazerUI);
      EventBus.off('ui:digitar-auto', this.aoDigitarAutoUI);
      EventBus.off('ui:proxima-fase', this.aoProximaFaseUI);
      if (this.input && this.input.keyboard) {
        this.input.keyboard.off('keydown', this.aoDigitar, this);
      }
    });
  }

  linhaAtual() {
    return this.nivel.linhas[this.currentLineIndex];
  }

  corDoSlot() {
    return this.nivel.hard ? COR_DESTAQUE_HARD : COR_DESTAQUE;
  }

  iniciarLinha(indice) {
    this.currentLineIndex = indice;
    const linha = this.linhaAtual();
    const y = LINHA_Y0 + indice * this.layout.passo;
    const corSlot = this.corDoSlot();

    EventBus.emit('linha:iniciada', { indice, dica: linha.dica });

    this.slotAtual = this.add.rectangle(LARGURA / 2, y, 880, this.layout.alturaSlot, 0x1b2a3a)
      .setStrokeStyle(2, corSlot);
    this.brilhoSlot = this.add.rectangle(LARGURA / 2, y, 884, this.layout.alturaSlot + 4)
      .setStrokeStyle(2, corSlot, 1)
      .setAlpha(0.2);
    this.areaSlot = new Phaser.Geom.Rectangle(40, y - this.layout.passo / 2, 880, this.layout.passo);
    this.numeroLinha = this.add.text(52, y, String(indice + 1), {
      fontFamily: FONTE, fontSize: '18px', color: '#5c6b7a'
    }).setOrigin(0, 0.5);

    if (!this.movimentoReduzido) {
      this.slotAtual.setAlpha(0);
      this.tweens.add({ targets: this.slotAtual, alpha: 1, duration: 240 });
      this.tweens.add({
        targets: this.brilhoSlot,
        alpha: 0.85,
        duration: 900,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    const textos = Phaser.Utils.Array.Shuffle(
      linha.blocos.concat(linha.distratores || [])
    );
    this.blocosPaleta = textos.map(t => this.criarBloco(t));
    this.blocosMontados = [];
    this.organizarPaleta(true);

    if (this.movimentoReduzido) return;
    this.blocosPaleta.forEach((b, i) => {
      b.setScale(0).setAlpha(0);
      this.tweens.add({
        targets: b,
        scale: 1,
        alpha: 1,
        duration: 260,
        delay: 40 * i,
        ease: 'Back.easeOut'
      });
    });
  }

  criarBloco(token) {
    const t = this.add.text(0, 0, token.texto, {
      fontFamily: FONTE, fontSize: '20px', color: '#0b0f14'
    }).setOrigin(0.5);
    const larg = Math.ceil(t.width) + PECA_PAD * 2;

    const forma = this.add.graphics();
    const bloco = this.add.container(0, 0, [forma, t]).setSize(larg, PECA_ALTURA);

    bloco.texto = token.texto;
    bloco.tipo = token.tipo;
    bloco.larg = larg;
    bloco.noMontado = false;
    bloco.congelado = false;
    bloco.tweenPos = null;
    bloco.tweenEscala = null;
    bloco.tweenAngulo = null;
    bloco.redesenhar = (cor, borda) => this.desenharPeca(forma, larg, cor, borda);
    bloco.redesenhar(TIPOS[token.tipo].cor, 0xffffff);

    bloco.setInteractive({ useHandCursor: true });
    this.input.setDraggable(bloco);

    bloco.on('pointerover', () => this.escalar(bloco, 1.06));
    bloco.on('pointerout', () => this.escalar(bloco, 1));
    bloco.on('pointerup', (pointer) => {
      const moveu = Phaser.Math.Distance.Between(
        pointer.downX, pointer.downY, pointer.upX, pointer.upY
      );
      if (moveu < this.limiteClique) this.aoClicarBloco(bloco);
    });

    return bloco;
  }

  desenharPeca(g, larg, cor, borda) {
    const w2 = larg / 2;
    const h2 = PECA_ALTURA / 2;
    const r = ENCAIXE_R;
    const pontos = [{ x: -w2, y: -h2 }, { x: w2, y: -h2 }, { x: w2, y: -r }];

    for (let a = -90; a <= 90; a += 15) {
      const rad = Phaser.Math.DegToRad(a);
      pontos.push({ x: w2 + r * Math.cos(rad), y: r * Math.sin(rad) });
    }
    pontos.push({ x: w2, y: h2 }, { x: -w2, y: h2 }, { x: -w2, y: r });

    for (let a = 90; a >= -90; a -= 15) {
      const rad = Phaser.Math.DegToRad(a);
      pontos.push({ x: -w2 + r * Math.cos(rad), y: r * Math.sin(rad) });
    }

    g.clear();
    g.fillStyle(cor, 1);
    g.fillPoints(pontos, true);
    g.lineStyle(2, borda, 1);
    g.strokePoints(pontos, true);
  }

  escalar(obj, valor) {
    if (this.movimentoReduzido || this.toque || !obj.active || obj.congelado) return;
    if (obj.tweenEscala) obj.tweenEscala.stop();
    obj.tweenEscala = this.tweens.add({
      targets: obj,
      scale: valor,
      duration: 120,
      ease: 'Sine.easeOut'
    });
  }

  configurarInputBlocos() {
    this.input.on('dragstart', (pointer, obj) => {
      this.pararMovimento(obj);
      obj.setDepth(10);
      this.escalar(obj, 1.08);
      audio.tocar('pegar');
    });

    this.input.on('drag', (pointer, obj, dragX, dragY) => {
      obj.x = dragX;
      obj.y = dragY;
      this.mostrarIndicador(obj);
    });

    this.input.on('dragend', (pointer, obj) => {
      obj.setDepth(0);
      this.escalar(obj, 1);
      this.ocultarIndicador();

      const moveu = Phaser.Math.Distance.Between(
        pointer.downX, pointer.downY, pointer.upX, pointer.upY
      );
      if (moveu < this.limiteClique) {
        this.organizarMontados();
        this.organizarPaleta();
        return;
      }

      const soltouNoSlot = Phaser.Geom.Rectangle.Contains(this.areaSlot, obj.x, obj.y);

      if (soltouNoSlot) {
        if (obj.noMontado) this.reordenarMontado(obj);
        else this.adicionarAoSlot(obj, this.indiceDeInsercao(obj.x));
      } else if (obj.noMontado) {
        this.removerDoSlot(obj);
      } else {
        this.organizarPaleta();
      }
    });
  }

  mostrarIndicador(obj) {
    if (!this.areaSlot || !this.slotAtual) return;
    const dentro = Phaser.Geom.Rectangle.Contains(this.areaSlot, obj.x, obj.y);
    this.slotAtual.setFillStyle(dentro ? 0x223a50 : 0x1b2a3a);

    if (!dentro) {
      this.ocultarIndicador();
      return;
    }

    const outros = this.blocosMontados.filter(b => b !== obj);
    const indice = outros.filter(b => b.x < obj.x).length;
    let x = 80 + this.linhaAtual().indent * INDENT_PX;
    for (let i = 0; i < indice; i++) x += outros[i].larg;

    if (!this.indicadorInsercao) {
      this.indicadorInsercao = this.add.rectangle(x, this.slotAtual.y, 4, PECA_ALTURA + 4, 0xffffff, 0.9)
        .setDepth(5);
    }
    this.indicadorInsercao.setPosition(x, this.slotAtual.y).setVisible(true);
  }

  ocultarIndicador() {
    if (this.indicadorInsercao) this.indicadorInsercao.setVisible(false);
    if (this.slotAtual) this.slotAtual.setFillStyle(0x1b2a3a);
  }

  aoClicarBloco(bloco) {
    if (this.isTypingMode || bloco.congelado) return;
    if (bloco.noMontado) this.removerDoSlot(bloco);
    else this.adicionarAoSlot(bloco, this.blocosMontados.length);
  }

  indiceDeInsercao(x) {
    return this.blocosMontados.filter(b => b.x < x).length;
  }

  adicionarAoSlot(bloco, indice) {
    this.blocosPaleta = this.blocosPaleta.filter(b => b !== bloco);
    this.blocosMontados.splice(indice, 0, bloco);
    bloco.noMontado = true;
    audio.tocar('encaixe');
    this.organizarMontados();
    this.organizarPaleta();
  }

  removerDoSlot(bloco, silencioso = false) {
    this.blocosMontados = this.blocosMontados.filter(b => b !== bloco);
    this.blocosPaleta.push(bloco);
    bloco.noMontado = false;
    if (!silencioso) audio.tocar('clique');
    this.organizarMontados();
    this.organizarPaleta();
  }

  reordenarMontado(bloco) {
    this.blocosMontados = this.blocosMontados.filter(b => b !== bloco);
    this.blocosMontados.splice(this.indiceDeInsercao(bloco.x), 0, bloco);
    audio.tocar('encaixe');
    this.organizarMontados();
  }

  desfazerUltima() {
    if (this.isTypingMode || this.blocosMontados.length === 0) return;
    this.removerDoSlot(this.blocosMontados[this.blocosMontados.length - 1]);
  }

  organizarMontados() {
    const y = this.slotAtual.y;
    let x = 80 + this.linhaAtual().indent * INDENT_PX;
    this.blocosMontados.forEach(b => {
      this.moverPara(b, x + b.larg / 2, y, false, 'Back.easeOut');
      x += b.larg;
    });
  }

  organizarPaleta(imediato = false) {
    let x = 40;
    let y = this.layout.paletaY;
    this.blocosPaleta.forEach(b => {
      if (x + b.larg > LARGURA - 40) {
        x = 40;
        y += PECA_ALTURA + 12;
      }
      this.moverPara(b, x + b.larg / 2, y, imediato);
      x += b.larg + ENCAIXE_R * 2 + 6;
    });
  }

  pararMovimento(obj) {
    if (obj.tweenPos) {
      obj.tweenPos.stop();
      obj.tweenPos = null;
    }
  }

  moverPara(obj, x, y, imediato = false, ease = 'Sine.easeOut') {
    this.pararMovimento(obj);
    if (imediato || this.movimentoReduzido) {
      obj.setPosition(x, y);
      return;
    }
    obj.tweenPos = this.tweens.add({ targets: obj, x, y, duration: 200, ease });
  }

  limparLinha() {
    if (this.isTypingMode) return;
    [...this.blocosMontados].forEach(b => this.removerDoSlot(b, true));
    audio.tocar('clique');
    EventBus.emit('linha:mensagem', '');
  }

  validarLinha() {
    if (this.isTypingMode) return;

    const montado = this.blocosMontados.map(b => b.texto);
    const esperado = this.linhaAtual().blocos.map(b => b.texto);

    if (montado.length === 0) {
      this.mostrarErro('Monte a linha com os blocos primeiro.');
      return;
    }

    const acertou = montado.length === esperado.length &&
      montado.every((t, i) => t === esperado[i]);

    if (acertou) this.congelarLinha();
    else this.mostrarErro('Ops! A ordem ou os blocos não estão certos.');
  }

  mostrarErro(msg) {
    EventBus.emit('linha:mensagem', msg);
    audio.tocar('erro');
    if (this.movimentoReduzido) return;

    this.cameras.main.shake(120, 0.003);
    this.blocosMontados.forEach(b => {
      b.redesenhar(0xff6b6b, 0xffffff);
      if (b.tweenAngulo) b.tweenAngulo.stop();
      b.tweenAngulo = this.tweens.add({
        targets: b,
        angle: { from: -4, to: 4 },
        duration: 60,
        yoyo: true,
        repeat: 3,
        onComplete: () => b.setAngle(0)
      });
      this.time.delayedCall(450, () => {
        if (b.active && b.noMontado && !b.congelado) b.redesenhar(TIPOS[b.tipo].cor, 0xffffff);
      });
    });
  }

  celebrarLinha() {
    audio.tocar('sucesso');
    if (this.movimentoReduzido) return;

    const y = this.slotAtual.y;
    const varredura = this.add.rectangle(40, y, 70, this.layout.alturaSlot, 0xffffff, 0.35).setDepth(15);
    this.tweens.add({
      targets: varredura,
      x: LARGURA - 40,
      alpha: 0,
      duration: 520,
      ease: 'Sine.easeIn',
      onComplete: () => varredura.destroy()
    });
    this.blocosMontados.forEach(b => this.emissor.explode(8, b.x, y));
  }

  congelarLinha() {
    this.celebrarLinha();

    this.tweens.killTweensOf(this.brilhoSlot);
    this.brilhoSlot.destroy();
    this.slotAtual.setFillStyle(0x12351f).setStrokeStyle(2, 0x2ecc71).setAlpha(0.7);

    this.blocosMontados.forEach(b => {
      if (b.tweenAngulo) b.tweenAngulo.stop();
      if (b.tweenEscala) b.tweenEscala.stop();
      b.setAngle(0).setScale(1);
      b.congelado = true;
      b.redesenhar(TIPOS[b.tipo].cor, 0x2ecc71);
      b.setAlpha(0.6);
      b.disableInteractive();
      this.objetosDaFase.push(b);
    });
    this.objetosDaFase.push(this.slotAtual, this.numeroLinha);

    this.blocosPaleta.forEach(b => b.destroy());
    this.blocosPaleta = [];
    this.blocosMontados = [];

    const proxima = this.currentLineIndex + 1;
    if (proxima < this.nivel.linhas.length) this.iniciarLinha(proxima);
    else this.iniciarTransicaoHacker();
  }

  iniciarTransicaoHacker() {
    this.isTypingMode = true;
    EventBus.emit('fase:modo', 'transicao');
    EventBus.emit('linha:mensagem', '');
    this.rotuloPaleta.setVisible(false);

    const sumir = this.objetosDaFase;

    this.tweens.add({
      targets: sumir,
      alpha: 0,
      y: '-=24',
      duration: this.movimentoReduzido ? 1 : 500,
      delay: (alvo, chave, valor, indice) => (this.movimentoReduzido ? 0 : indice * 40),
      onComplete: () => {
        sumir.forEach(o => o.destroy());
        this.objetosDaFase = [];
        this.criarPainelIDE();
        this.ativarFakeTyping();
      }
    });
  }

  criarPainelIDE() {
    const painel = this.add.container(LARGURA / 2, ALTURA / 2).setAlpha(0);

    const corpo = this.add.rectangle(0, 0, 880, 440, 0x0d1117).setStrokeStyle(2, 0x30363d);
    const barra = this.add.rectangle(0, -200, 880, 36, 0x161b22);
    const pontos = [0xff5f56, 0xffbd2e, 0x27c93f].map((cor, i) =>
      this.add.circle(-416 + i * 22, -200, 6, cor)
    );
    const titulo = this.add.text(0, -200, this.nivel.arquivo, {
      fontFamily: FONTE, fontSize: '14px', color: '#8b98a5'
    }).setOrigin(0.5);

    this.txtIDE = this.add.text(-410, -160, '█', {
      fontFamily: FONTE, fontSize: '24px', color: '#3fb950', lineSpacing: 10
    });
    const linhas = this.add.tileSprite(0, 0, 880, 440, 'scanline').setAlpha(0.12);

    painel.add([corpo, barra, ...pontos, titulo, this.txtIDE, linhas]);
    this.painelIDE = painel;

    painel.setScale(this.movimentoReduzido ? 1 : 0.96);
    this.tweens.add({
      targets: painel,
      alpha: 1,
      scale: 1,
      duration: this.movimentoReduzido ? 1 : 400,
      ease: 'Back.easeOut'
    });

    this.temporizadorCursor = this.time.addEvent({
      delay: 480,
      loop: true,
      callback: () => {
        this.cursorVisivel = !this.cursorVisivel;
        if (this.isTypingMode) this.renderizarIDE();
      }
    });
  }

  renderizarIDE() {
    const cursor = this.cursorVisivel ? '█' : ' ';
    this.txtIDE.setText(this.codigoCompleto.slice(0, this.charIndex) + cursor);
  }

  ativarFakeTyping() {
    this.charIndex = 0;
    this.criarAvisoDigitacao();
    EventBus.emit('fase:modo', 'digitando');
    this.emitirProgresso();

    if (this.toque) {
      this.iniciarDigitacaoAutomatica();
      return;
    }

    this.input.keyboard.on('keydown', this.aoDigitar, this);
    this.agendarAvisoDigitacao();
  }

  iniciarDigitacaoAutomatica() {
    if (!this.isTypingMode || !this.txtIDE || this.digitacaoAutomatica) return;

    this.digitacaoAutomatica = true;
    if (this.input.keyboard) this.input.keyboard.off('keydown', this.aoDigitar, this);
    this.cancelarAvisoDigitacao();
    EventBus.emit('digitacao:auto', true);

    this.temporizadorAuto = this.time.addEvent({
      delay: INTERVALO_AUTO_MS,
      loop: true,
      callback: () => {
        audio.tocar('tecla');
        this.avancarDigitacao();
      }
    });
  }

  aoDigitar() {
    if (!this.isTypingMode) return;
    audio.tocar('tecla');
    if (!this.movimentoReduzido) this.cameras.main.shake(40, 0.0006);
    this.agendarAvisoDigitacao();
    this.avancarDigitacao();
  }

  avancarDigitacao() {
    if (!this.isTypingMode) return;

    const avanco = Phaser.Math.Between(1, 3);
    this.charIndex = Math.min(this.charIndex + avanco, this.codigoCompleto.length);
    this.renderizarIDE();
    this.emitirProgresso();

    if (this.charIndex >= this.codigoCompleto.length) this.finalizarDigitacao();
  }

  emitirProgresso() {
    EventBus.emit('digitacao:progresso', {
      atual: this.charIndex,
      total: this.codigoCompleto.length
    });
  }

  criarAvisoDigitacao() {
    const fundo = this.add.rectangle(0, 0, 640, 72, 0x000000, 0.82).setStrokeStyle(2, 0x3fb950);
    const texto = this.add.text(0, 0, 'Pressione qualquer tecla para escrever o código', {
      fontFamily: FONTE, fontSize: '20px', color: '#3fb950'
    }).setOrigin(0.5);

    this.avisoDigitacao = this.add.container(LARGURA / 2, ALTURA / 2, [fundo, texto])
      .setDepth(30)
      .setAlpha(0);

    if (this.movimentoReduzido) return;
    this.tweens.add({
      targets: texto,
      scale: { from: 1, to: 1.05 },
      duration: 700,
      yoyo: true,
      repeat: -1
    });
  }

  agendarAvisoDigitacao() {
    this.cancelarAvisoDigitacao();
    this.temporizadorOcioso = this.time.delayedCall(ATRASO_AVISO_MS, () => this.exibirAviso(true));
  }

  cancelarAvisoDigitacao() {
    if (this.temporizadorOcioso) {
      this.temporizadorOcioso.remove(false);
      this.temporizadorOcioso = null;
    }
    this.exibirAviso(false);
  }

  exibirAviso(visivel) {
    if (!this.avisoDigitacao) return;
    this.tweens.killTweensOf(this.avisoDigitacao);
    this.tweens.add({ targets: this.avisoDigitacao, alpha: visivel ? 1 : 0, duration: 180 });
  }

  finalizarDigitacao() {
    this.isTypingMode = false;
    if (this.input.keyboard) this.input.keyboard.off('keydown', this.aoDigitar, this);
    [this.temporizadorAuto, this.temporizadorCursor].forEach(t => t && t.remove(false));
    this.temporizadorAuto = null;
    this.temporizadorCursor = null;
    this.cancelarAvisoDigitacao();
    this.txtIDE.setText(this.codigoCompleto);
    EventBus.emit('fase:modo', 'concluido');

    this.time.delayedCall(600, () => EventBus.emit('fase:vitoria', {
      saida: this.nivel.saida,
      agradecimento: this.nivel.agradecimento,
      aprendizado: this.nivel.aprendizado
    }));
  }
}
