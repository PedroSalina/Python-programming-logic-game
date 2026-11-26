<script setup>
defineProps({
  tamanho: { type: Number, default: 48 }
});
</script>

<template>
  <svg :width="tamanho" :height="tamanho" viewBox="0 0 64 64" role="img" aria-label="Logicompany">
    <rect x="4" y="4" width="56" height="56" rx="14" fill="#4cc9f0" />
    <path d="M20 16h10v22h14v10H20z" fill="#0b0f14" />
    <circle cx="44" cy="22" r="5" fill="#0b0f14" />
  </svg>
</template>
