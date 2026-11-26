export const TIPOS = {
  var:   { nome: 'Variável',  ajuda: 'nome que guarda um valor',                        cor: 0x4cc9f0 },
  valor: { nome: 'Valor',     ajuda: 'texto ou número',                                 cor: 0xffd166 },
  op:    { nome: 'Operador',  ajuda: 'compara, calcula ou atribui (=, ==, +, and)',     cor: 0xff9f43 },
  ctrl:  { nome: 'Controle',  ajuda: 'decide, repete ou define (if, for, while, def)',  cor: 0xb388ff },
  func:  { nome: 'Função',    ajuda: 'faz uma ação (print, range)',                     cor: 0x6ee7a0 },
  pont:  { nome: 'Pontuação', ajuda: 'fecha ou separa: dois-pontos, parênteses e vírgula', cor: 0xcfd8dc }
};

export const corCss = (n) => '#' + n.toString(16).padStart(6, '0');
