<script setup>
import { animar } from '../utils/movimento';

const entrar = (el, concluir) => {
  const altura = el.scrollHeight;
  el.style.overflow = 'hidden';
  animar(el, {
    height: ['0px', `${altura}px`],
    opacity: [0, 1],
    duration: 260,
    ease: 'outQuad',
    onComplete: () => {
      el.style.height = '';
      el.style.overflow = '';
      concluir();
    }
  });
};

const sair = (el, concluir) => {
  el.style.overflow = 'hidden';
  animar(el, {
    height: [`${el.scrollHeight}px`, '0px'],
    opacity: [1, 0],
    duration: 200,
    ease: 'inQuad',
    onComplete: concluir
  });
};
</script>

<template>
  <Transition :css="false" @enter="entrar" @leave="sair">
    <slot />
  </Transition>
</template>
