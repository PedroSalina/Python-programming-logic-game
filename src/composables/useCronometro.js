import { reactive, onBeforeUnmount } from 'vue';

export function useCronometro() {
  const estado = reactive({ rodando: false, pausado: false, decorrido: 0 });
  let inicio = 0;
  let acumulado = 0;
  let intervalo = null;

  const atualizar = () => {
    estado.decorrido = acumulado + (performance.now() - inicio);
  };

  const agendar = () => {
    inicio = performance.now();
    intervalo = setInterval(atualizar, 100);
  };

  const cancelar = () => {
    if (intervalo !== null) {
      clearInterval(intervalo);
      intervalo = null;
    }
  };

  const zerar = () => {
    cancelar();
    acumulado = 0;
    estado.decorrido = 0;
    estado.rodando = false;
    estado.pausado = false;
  };

  const iniciar = () => {
    zerar();
    estado.rodando = true;
    agendar();
  };

  const pausar = () => {
    if (!estado.rodando || estado.pausado) return;
    atualizar();
    acumulado = estado.decorrido;
    cancelar();
    estado.pausado = true;
  };

  const retomar = () => {
    if (!estado.rodando || !estado.pausado) return;
    estado.pausado = false;
    agendar();
  };

  const parar = () => {
    if (estado.rodando && !estado.pausado) atualizar();
    cancelar();
    estado.rodando = false;
    estado.pausado = false;
    return estado.decorrido;
  };

  onBeforeUnmount(cancelar);

  return { estado, iniciar, pausar, retomar, zerar, parar };
}
