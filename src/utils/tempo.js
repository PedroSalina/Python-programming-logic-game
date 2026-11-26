const doisDigitos = (n) => String(n).padStart(2, '0');

const formatarSegundos = (segundos) =>
  `${doisDigitos(Math.floor(segundos / 60))}:${doisDigitos(segundos % 60)}`;

export function formatarDuracao(ms) {
  return formatarSegundos(Math.floor(Math.max(0, ms) / 1000));
}

export function formatarRestante(ms) {
  if (ms >= 0) return formatarSegundos(Math.ceil(ms / 1000));
  const atraso = Math.floor(-ms / 1000);
  return atraso > 0 ? `-${formatarSegundos(atraso)}` : formatarSegundos(0);
}
