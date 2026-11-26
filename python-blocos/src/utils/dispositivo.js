export const ehDispositivoDeToque = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: none) and (pointer: coarse)').matches;
