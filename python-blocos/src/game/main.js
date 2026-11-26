import Phaser from 'phaser';
import { GameplayScene } from './scenes/GameplayScene';
import { LARGURA, ALTURA } from './constants';

export default function StartGame(parent) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: LARGURA,
    height: ALTURA,
    backgroundColor: '#0f1722',
    physics: { default: 'arcade', arcade: { debug: false } },
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: [GameplayScene]
  });
}
