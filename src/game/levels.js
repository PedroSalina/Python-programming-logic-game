export const EMPRESA = 'Logicompany';
export const GERENTE = 'Sérgio W';

const t = (tipo) => (texto) => ({ texto, tipo });
const VAR = t('var');
const VAL = t('valor');
const OP = t('op');
const CTRL = t('ctrl');
const FUN = t('func');
const PON = t('pont');

export const NIVEIS_NORMAIS = [
  {
    id: 'cadastro',
    titulo: 'Cadastro do estagiário',
    resumo: `A Malu, do RH da ${EMPRESA}, precisa registrar o seu cargo no sistema.`,
    cliente: { empresa: EMPRESA, setor: 'Recursos Humanos', contato: 'Malu', cargo: 'RH', cor: '#ff9f43' },
    email: {
      assunto: `Seu cadastro no sistema da ${EMPRESA}`,
      hora: 'Seg, 08:12',
      notaGerente: 'Olá! Agora você faz parte do time de desenvolvimento. Para iniciar, você prestará serviços simples de programação para empresas parceiras: cada cliente manda um pedido, você escreve o código e a gente entrega. Antes dos clientes, a Malu, do RH, tem um primeiro serviço para você. Mãos à obra',
      paragrafos: [
        `Oi! Aqui é a Malu, do RH da ${EMPRESA}. Seja muito bem-vindo(a) ao time!`,
        'Antes de você começar a atender os clientes, preciso cadastrar o seu cargo no nosso sistema e conferir se deu tudo certo na tela. Pode me ajudar com isso? É rapidinho e é um ótimo jeito de dar os primeiros passos em programação.'
      ],
      pedidos: [
        'Guardar o seu cargo numa variável',
        'Mostrar o cargo na tela'
      ],
      assinatura: `Malu · RH · ${EMPRESA}`
    },
    arquivo: 'cadastro.py',
    saida: 'Estagiário',
    agradecimento: 'Cadastro feito! Seu crachá já está sendo impresso. Boa sorte nos serviços!',
    aprendizado: 'Uma variável guarda um valor (cargo = "Estagiário") e o print() mostra esse valor na tela.',
    linhas: [
      {
        indent: 0,
        blocos: [VAR('cargo'), OP('='), VAL('"Estagiário"')],
        distratores: [OP('= ='), VAL('"Gerente"')],
        dica: 'Guarde o seu cargo numa variável: uma peça azul (o nome da variável), o sinal de = e uma peça amarela com o cargo entre aspas.'
      },
      {
        indent: 0,
        blocos: [FUN('print('), VAR('cargo'), PON(')')],
        distratores: [FUN('input('), VAL('"cargo"')],
        dica: 'Mostre o cargo na tela: abra o print(, coloque a variável cargo (a peça azul, sem aspas) e feche com ).'
      }
    ]
  },

  {
    id: 'totem',
    titulo: 'Boas-vindas no totem',
    resumo: 'O totem de pedidos do Café Aurora está sem mensagem de boas-vindas.',
    cliente: { empresa: 'Café Aurora', setor: 'Cafeteria', contato: 'Bia', cargo: 'Proprietária', cor: '#f783ac' },
    email: {
      assunto: 'Pedido: mensagem de boas-vindas no totem',
      hora: 'Seg, 09:30',
      notaGerente: 'Primeiro cliente de verdade! O pedido é simples: guardar duas informações e juntar tudo numa mensagem.',
      paragrafos: [
        'Oi! Aqui é a Bia, do Café Aurora. Abrimos nossa segunda unidade esta semana e o totem de pedidos ainda está mudo.',
        'A ideia é que, quando o cliente chegar, a tela mostre uma mensagem de boas-vindas com o nome da loja.'
      ],
      pedidos: [
        'Guardar o nome da loja numa variável',
        'Guardar a saudação em outra variável',
        'Mostrar a saudação junto com o nome da loja na tela'
      ],
      assinatura: 'Bia · Café Aurora'
    },
    arquivo: 'totem.py',
    saida: 'Bem-vindo ao Café Aurora',
    agradecimento: 'Ficou lindo! O totem já está recebendo os clientes. Obrigada!',
    aprendizado: 'Variáveis guardam informações (nome = valor) e print() mostra algo na tela. O + junta textos.',
    linhas: [
      {
        indent: 0,
        blocos: [VAR('loja'), OP('='), VAL('"Café Aurora"')],
        distratores: [OP('=='), VAL('"Padaria Sol"')],
        dica: 'Guarde o nome da loja numa variável: uma peça azul (o nome da variável), o sinal de = e uma peça amarela com o nome entre aspas.'
      },
      {
        indent: 0,
        blocos: [VAR('saudacao'), OP('='), VAL('"Bem-vindo ao "')],
        distratores: [VAL('"Tchau, "'), OP('+')],
        dica: 'Faça o mesmo com a saudação: variável, =, e a frase entre aspas (repare que ela termina com um espaço, para não colar no nome da loja).'
      },
      {
        indent: 0,
        blocos: [FUN('print('), VAR('saudacao'), OP('+'), VAR('loja'), PON(')')],
        distratores: [FUN('input('), VAL('" e "')],
        dica: 'Mostre a mensagem completa: abra o print(, junte as duas variáveis com + (a saudação vem primeiro) e feche com ).'
      }
    ]
  },

  {
    id: 'ponto',
    titulo: 'Ponto dos motoristas',
    resumo: 'A Veloz Logística quer um aviso para quem chega no horário ao galpão.',
    cliente: { empresa: 'Veloz Logística', setor: 'Logística', contato: 'Caio', cargo: 'Coordenador de frota', cor: '#4cc9f0' },
    email: {
      assunto: 'Pedido: aviso de chegada no ponto eletrônico',
      hora: 'Seg, 10:40',
      notaGerente: 'Cliente novo, do ramo de logística. O pedido é simples: é só comparar a hora de chegada com o limite.',
      paragrafos: [
        'Fala! Aqui é o Caio, da Veloz Logística.',
        'Nossos caminhões saem do galpão às 9h30, e quem chega depois das 9h atrasa o carregamento. Precisamos que o ponto eletrônico dos motoristas avise quando alguém chegar dentro do horário.'
      ],
      pedidos: [
        'Guardar a hora de chegada em uma variável',
        'Verificar se a hora é menor ou igual a 9',
        'Se for, mostrar "Chegou no horário"'
      ],
      assinatura: 'Caio · Veloz Logística'
    },
    arquivo: 'ponto.py',
    saida: 'Chegou no horário',
    agradecimento: 'Perfeito! Agora o carregamento sai no horário. Valeu!',
    aprendizado: 'O if executa o bloco recuado só quando a condição é verdadeira. <= significa "menor ou igual".',
    linhas: [
      {
        indent: 0,
        blocos: [VAR('hora'), OP('='), VAL('9')],
        distratores: [OP('=='), VAL('18')],
        dica: 'Guarde a hora de chegada do motorista numa variável: variável, = e o número 9.'
      },
      {
        indent: 0,
        blocos: [CTRL('if'), VAR('hora'), OP('<='), VAL('9'), PON(':')],
        distratores: [OP('>='), CTRL('while')],
        dica: 'Pergunte se a hora é menor ou igual ao limite: if (roxa), a variável, o operador <=, o número 9 e os dois-pontos no final.'
      },
      {
        indent: 1,
        blocos: [FUN('print('), VAL('"Chegou no horário"'), PON(')')],
        distratores: [VAL('"Chegou atrasado"')],
        dica: 'Esta linha só roda se o if for verdadeiro, por isso fica recuada. Use print( com a frase certa entre aspas e feche o parêntese.'
      }
    ]
  },

  {
    id: 'estoque',
    titulo: 'Estoque da mercearia',
    resumo: 'A Mercearia Estrela quer saber, no fim do dia, se vende ou se repõe.',
    cliente: { empresa: 'Mercearia Estrela', setor: 'Comércio de bairro', contato: 'Dona Lúcia', cargo: 'Proprietária', cor: '#6ee7a0' },
    email: {
      assunto: 'Pedido: aviso de estoque',
      hora: 'Ter, 09:05',
      notaGerente: 'A Dona Lúcia é cliente antiga e gosta de tudo bem explicadinho. Desta vez o código precisa escolher entre dois caminhos.',
      paragrafos: [
        'Bom dia, meu bem! Aqui é a Lúcia, da Mercearia Estrela.',
        'No fim do dia eu nunca sei se ainda tem produto na prateleira ou se preciso repor. Queria que o sistema olhasse o estoque e me dissesse o que fazer: vender, se tiver, ou repor, se acabou.'
      ],
      pedidos: [
        'Guardar a quantidade em estoque (hoje está zerado)',
        'Se o estoque for maior que zero, mandar vender',
        'Senão, mandar repor'
      ],
      assinatura: 'Lúcia · Mercearia Estrela'
    },
    arquivo: 'estoque.py',
    saida: 'Repor estoque',
    agradecimento: 'Que maravilha, meu bem! Agora sei na hora quando repor. Obrigada!',
    aprendizado: 'O else define o que fazer quando o if é falso: o programa escolhe entre dois caminhos.',
    linhas: [
      {
        indent: 0,
        blocos: [VAR('estoque'), OP('='), VAL('0')],
        distratores: [OP('=='), VAL('50')],
        dica: 'Guarde a quantidade em estoque numa variável. Hoje o estoque está zerado.'
      },
      {
        indent: 0,
        blocos: [CTRL('if'), VAR('estoque'), OP('>'), VAL('0'), PON(':')],
        distratores: [OP('<'), CTRL('for')],
        dica: 'Pergunte se o estoque é maior que zero: if, a variável, o operador >, o número 0 e os dois-pontos.'
      },
      {
        indent: 1,
        blocos: [FUN('print('), VAL('"Vender produto"'), PON(')')],
        distratores: [VAL('"Repor estoque"')],
        dica: 'Este é o caminho do "sim" (tem produto), por isso fica recuado: mostre a frase de vender.'
      },
      {
        indent: 0,
        blocos: [CTRL('else'), PON(':')],
        distratores: [CTRL('elif'), CTRL('if')],
        dica: 'E se a condição for falsa? Use else seguido de dois-pontos. Ele fica alinhado com o if (sem recuo).'
      },
      {
        indent: 1,
        blocos: [FUN('print('), VAL('"Repor estoque"'), PON(')')],
        distratores: [VAL('"Vender produto"')],
        dica: 'Este é o caminho do "não" (acabou o produto): mostre a frase de repor.'
      }
    ]
  },

  {
    id: 'orcamento',
    titulo: 'Controle de orçamento',
    resumo: 'A Saldo Certo quer um alerta quando as compras de um cliente passam do orçamento.',
    cliente: { empresa: 'Saldo Certo Contabilidade', setor: 'Contabilidade', contato: 'Victoria', cargo: 'Contadora', cor: '#b388ff' },
    email: {
      assunto: 'Pedido: alerta de orçamento estourado',
      hora: 'Ter, 14:30',
      notaGerente: 'Contabilidade! Aqui o código faz uma conta de multiplicação e compara o resultado com um limite.',
      paragrafos: [
        'Olá! Aqui é a Victoria, do escritório Saldo Certo Contabilidade.',
        'Um dos nossos clientes tem um orçamento de 2000 por mês para material de escritório. Todo mês eu confiro na mão se ele passou do limite, e isso toma um tempão.',
        'Neste mês ele comprou 5 itens de 450 cada. Preciso que o sistema calcule o gasto total e me avise se o orçamento estourou.'
      ],
      pedidos: [
        'Guardar o preço de cada item e a quantidade comprada',
        'Calcular o gasto total (preço × quantidade)',
        'Se o gasto passar de 2000, mostrar "Orçamento estourado"'
      ],
      assinatura: 'Victoria · Saldo Certo Contabilidade'
    },
    arquivo: 'orcamento.py',
    saida: 'Orçamento estourado',
    agradecimento: 'Perfeito! Agora recebo o alerta na hora, sem conferir nada na mão. Obrigada!',
    aprendizado: 'O operador * multiplica valores (preço * quantidade). O resultado vai para uma variável e o if compara esse total com um limite.',
    linhas: [
      {
        indent: 0,
        blocos: [VAR('preco'), OP('='), VAL('450')],
        distratores: [OP('=='), VAL('45')],
        dica: 'Guarde o preço de cada item numa variável: variável, = e o número 450.'
      },
      {
        indent: 0,
        blocos: [VAR('quantidade'), OP('='), VAL('5')],
        distratores: [VAL('50'), OP('+')],
        dica: 'Guarde a quantidade de itens comprados em outra variável.'
      },
      {
        indent: 0,
        blocos: [VAR('gasto'), OP('='), VAR('preco'), OP('*'), VAR('quantidade')],
        distratores: [OP('+'), VAL('0')],
        dica: 'O gasto total é preço vezes quantidade. Use o operador de multiplicação (*).'
      },
      {
        indent: 0,
        blocos: [CTRL('if'), VAR('gasto'), OP('>'), VAL('2000'), PON(':')],
        distratores: [OP('<'), VAL('200')],
        dica: 'Pergunte se o gasto passou do orçamento: if, a variável gasto, o operador >, o limite 2000 e os dois-pontos.'
      },
      {
        indent: 1,
        blocos: [FUN('print('), VAL('"Orçamento estourado"'), PON(')')],
        distratores: [VAL('"Dentro do orçamento"')],
        dica: 'Só roda se o gasto passou do limite (por isso fica recuado): mostre o alerta.'
      }
    ]
  },

  {
    id: 'acesso',
    titulo: 'Porta do servidor',
    resumo: 'A Nuvem Segura só quer liberar a sala de servidores para quem pode.',
    cliente: { empresa: 'Nuvem Segura', setor: 'Hospedagem de sites', contato: 'Rui', cargo: 'Analista de TI', cor: '#ff6b6b' },
    email: {
      assunto: 'Pedido: controle de acesso à sala de servidores',
      hora: 'Qua, 11:20',
      notaGerente: 'Segurança! Aqui há duas condições ao mesmo tempo. Atenção ao and.',
      paragrafos: [
        'E aí! Aqui é o Rui, da Nuvem Segura, empresa de hospedagem de sites.',
        'Na nossa sala de servidores só pode entrar quem tem nível de acesso 2 ou mais e o crachá ativo. Se uma das duas coisas falhar, a porta não abre.'
      ],
      pedidos: [
        'Guardar o nível de acesso (3) e o estado do crachá (ativo)',
        'Verificar as duas condições juntas',
        'Se as duas forem verdadeiras, mostrar "Acesso liberado"'
      ],
      assinatura: 'Rui · Nuvem Segura'
    },
    arquivo: 'acesso.py',
    saida: 'Acesso liberado',
    agradecimento: 'Porta protegida! A sala de servidores está bem mais segura. Obrigado!',
    aprendizado: 'O and exige que as DUAS condições sejam verdadeiras ao mesmo tempo. Operadores lógicos combinam condições.',
    linhas: [
      {
        indent: 0,
        blocos: [VAR('nivel'), OP('='), VAL('3')],
        distratores: [OP('=='), VAL('1')],
        dica: 'Guarde o nível de acesso da pessoa: variável, = e o número 3.'
      },
      {
        indent: 0,
        blocos: [VAR('ativo'), OP('='), VAL('True')],
        distratores: [VAL('False'), OP('==')],
        dica: 'Guarde se o crachá está ativo. True significa verdadeiro (e False, falso).'
      },
      {
        indent: 0,
        blocos: [CTRL('if'), VAR('nivel'), OP('>='), VAL('2'), OP('and'), VAR('ativo'), PON(':')],
        distratores: [OP('or'), OP('<=')],
        dica: 'Duas condições juntas: nível maior ou igual a 2 E crachá ativo. O and liga as duas. Termine com dois-pontos.'
      },
      {
        indent: 1,
        blocos: [FUN('print('), VAL('"Acesso liberado"'), PON(')')],
        distratores: [VAL('"Acesso negado"')],
        dica: 'Só roda se as duas condições forem verdadeiras: a porta abre.'
      }
    ]
  },

  {
    id: 'relatorio',
    titulo: 'Relatório da semana',
    resumo: 'Pedido interno do gerente: somar os atendimentos da equipe em 3 dias.',
    cliente: { empresa: EMPRESA, setor: 'Pedido interno', contato: GERENTE, cargo: 'Gerente', cor: '#ffd166' },
    email: {
      interno: true,
      assunto: 'Pedido interno: relatório da semana',
      hora: 'Sex, 16:45',
      paragrafos: [
        `Estagiário(a), foi uma ótima semana na ${EMPRESA}! Antes de fechar a sexta, preciso do relatório de atendimentos da equipe.`,
        'Fizemos 10 atendimentos por dia durante 3 dias. Em vez de somar na mão, quero que o código repita a soma para cada dia e mostre o total no final.'
      ],
      pedidos: [
        'Começar o total em zero',
        'Repetir 3 vezes (uma por dia): somar 10 ao total',
        'Mostrar o total quando a repetição acabar'
      ],
      assinatura: `${GERENTE} · Gerente da ${EMPRESA}`
    },
    arquivo: 'relatorio.py',
    saida: '30',
    agradecimento: 'Relatório entregue! Parabéns, você concluiu todos os serviços da semana.',
    aprendizado: 'O for repete um bloco várias vezes. Aqui, total acumula +10 a cada volta: 0 → 10 → 20 → 30.',
    linhas: [
      {
        indent: 0,
        blocos: [VAR('total'), OP('='), VAL('0')],
        distratores: [OP('=='), VAL('30')],
        dica: 'Comece o total em zero: variável, = e o número 0.'
      },
      {
        indent: 0,
        blocos: [CTRL('for'), VAR('dia'), CTRL('in'), FUN('range('), VAL('3'), PON(')'), PON(':')],
        distratores: [CTRL('while'), VAL('30')],
        dica: 'Repita para cada dia, 3 vezes: for, a variável dia, in, range( com o número 3, o parêntese e os dois-pontos.'
      },
      {
        indent: 1,
        blocos: [VAR('total'), OP('='), VAR('total'), OP('+'), VAL('10')],
        distratores: [OP('-'), VAL('3')],
        dica: 'A cada volta, some 10 ao total: total recebe total + 10. Fica recuada, pois faz parte da repetição.'
      },
      {
        indent: 0,
        blocos: [FUN('print('), VAR('total'), PON(')')],
        distratores: [VAR('dia'), FUN('input(')],
        dica: 'Fora do for (sem recuo): mostre o total final, depois que a repetição acabar.'
      }
    ]
  }
];

export const NIVEIS_HARD = [
  {
    id: 'hard-reposicao',
    hard: true,
    tempoLimite: 180,
    titulo: 'Reposição inteligente',
    resumo: 'A Mercearia Estrela quer saber em quantos dias o leite vai acabar.',
    cliente: { empresa: 'Mercearia Estrela', setor: 'Comércio de bairro', contato: 'Dona Lúcia', cargo: 'Proprietária', cor: '#6ee7a0' },
    email: {
      assunto: 'Desafio: em quantos dias o estoque acaba?',
      hora: 'Qui, 10:15',
      notaGerente: 'Bem-vindo(a) ao nível hard! Os pedidos agora são mais complexos e têm cronômetro. Respire fundo: dá para pausar, e estourar o tempo não é game over.',
      paragrafos: [
        'Oi de novo, meu bem! Aqui é a Lúcia, da Mercearia Estrela.',
        'Tenho 10 caixas de leite no estoque e vendo 3 por dia. Quero saber em quantos dias o leite vai acabar para fazer o pedido ao fornecedor antes disso.',
        'Dá para o sistema repetir a conta dia após dia, até o estoque chegar a zero ou menos, contando os dias?'
      ],
      pedidos: [
        'Guardar o estoque inicial (10) e começar a contagem de dias em zero',
        'Enquanto houver estoque, tirar 3 caixas e contar mais um dia',
        'Mostrar quantos dias se passaram'
      ],
      assinatura: 'Lúcia · Mercearia Estrela'
    },
    arquivo: 'reposicao.py',
    saida: '4',
    agradecimento: 'Perfeito! Agora sei que preciso fazer o pedido antes do quarto dia. Obrigada!',
    aprendizado: 'O while repete um bloco enquanto a condição for verdadeira. Ao contrário do for, não sabemos de antemão quantas voltas serão: o estoque decide quando parar.',
    linhas: [
      {
        indent: 0,
        blocos: [VAR('estoque'), OP('='), VAL('10')],
        distratores: [OP('=='), VAL('3')],
        dica: 'Guarde o estoque inicial de caixas numa variável: variável, = e o número 10.'
      },
      {
        indent: 0,
        blocos: [VAR('dias'), OP('='), VAL('0')],
        distratores: [VAL('1'), OP('+')],
        dica: 'Crie o contador de dias, começando em zero.'
      },
      {
        indent: 0,
        blocos: [CTRL('while'), VAR('estoque'), OP('>'), VAL('0'), PON(':')],
        distratores: [CTRL('if'), OP('<')],
        dica: 'Repita enquanto houver estoque: while (roxa), a variável estoque, o operador >, o número 0 e os dois-pontos. O while volta a testar a condição a cada volta.'
      },
      {
        indent: 1,
        blocos: [VAR('estoque'), OP('='), VAR('estoque'), OP('-'), VAL('3')],
        distratores: [OP('+'), VAL('10')],
        dica: 'Dentro do while (recuada), tire 3 caixas: estoque recebe estoque - 3.'
      },
      {
        indent: 1,
        blocos: [VAR('dias'), OP('='), VAR('dias'), OP('+'), VAL('1')],
        distratores: [OP('-'), VAL('0')],
        dica: 'Ainda dentro do while (recuada), conte mais um dia: dias recebe dias + 1.'
      },
      {
        indent: 0,
        blocos: [FUN('print('), VAR('dias'), PON(')')],
        distratores: [VAR('estoque'), FUN('input(')],
        dica: 'Fora do while (sem recuo), mostre quantos dias se passaram.'
      }
    ]
  },

  {
    id: 'hard-premium',
    hard: true,
    tempoLimite: 150,
    titulo: 'Entregas premium',
    resumo: 'A Veloz Logística quer contar quantas entregas do dia são premium.',
    cliente: { empresa: 'Veloz Logística', setor: 'Logística', contato: 'Caio', cargo: 'Coordenador de frota', cor: '#4cc9f0' },
    email: {
      assunto: 'Desafio: contagem de entregas premium',
      hora: 'Qui, 15:40',
      notaGerente: 'Mais um desafio: agora com um if dentro de um for. Pense em qual bloco fica dentro de qual.',
      paragrafos: [
        'Fala de novo! Aqui é o Caio, da Veloz Logística.',
        'Hoje saíram 7 entregas, numeradas de 1 a 7. A regra da casa: toda entrega com número múltiplo de 3 (a 3ª, a 6ª...) é premium e rende um bônus ao motorista.',
        'Preciso que o sistema percorra as entregas e conte quantas são premium.'
      ],
      pedidos: [
        'Começar o contador de entregas premium em zero',
        'Percorrer as entregas de 1 a 7',
        'A cada entrega com número múltiplo de 3, somar 1 ao contador',
        'Mostrar o total de entregas premium'
      ],
      assinatura: 'Caio · Veloz Logística'
    },
    arquivo: 'premium.py',
    saida: '2',
    agradecimento: 'Contagem certinha! Os bônus dos motoristas saem sem erro hoje. Valeu!',
    aprendizado: 'Estruturas aninhadas: um if dentro de um for. O operador % (resto da divisão) identifica múltiplos: n % 3 == 0 é verdadeiro quando n é múltiplo de 3.',
    linhas: [
      {
        indent: 0,
        blocos: [VAR('premium'), OP('='), VAL('0')],
        distratores: [OP('=='), VAL('1')],
        dica: 'Comece o contador de entregas premium em zero.'
      },
      {
        indent: 0,
        blocos: [CTRL('for'), VAR('entrega'), CTRL('in'), FUN('range('), VAL('1'), PON(','), VAL('8'), PON(')'), PON(':')],
        distratores: [CTRL('while'), VAL('7')],
        dica: 'Percorra as entregas de 1 a 7: for, a variável entrega, in, range( com 1, vírgula, 8 e o parêntese, e os dois-pontos. O range para antes do último número: range(1, 8) vai de 1 até 7.'
      },
      {
        indent: 1,
        blocos: [CTRL('if'), VAR('entrega'), OP('%'), VAL('3'), OP('=='), VAL('0'), PON(':')],
        distratores: [OP('='), OP('/')],
        dica: 'Dentro do for (recuada): o operador % dá o resto da divisão. Se o resto da divisão por 3 é 0 (entrega % 3 == 0), a entrega é a 3ª, a 6ª... Atenção: == compara, = atribui.'
      },
      {
        indent: 2,
        blocos: [VAR('premium'), OP('='), VAR('premium'), OP('+'), VAL('1')],
        distratores: [OP('-'), VAL('3')],
        dica: 'Dentro do if (mais recuada ainda): some 1 ao contador premium.'
      },
      {
        indent: 0,
        blocos: [FUN('print('), VAR('premium'), PON(')')],
        distratores: [VAR('entrega'), FUN('input(')],
        dica: 'Fora do for (sem recuo): mostre quantas entregas premium houve.'
      }
    ]
  },

  {
    id: 'hard-desconto',
    hard: true,
    tempoLimite: 150,
    titulo: 'Função de desconto',
    resumo: 'A Saldo Certo quer uma função que aplique desconto às mensalidades.',
    cliente: { empresa: 'Saldo Certo Contabilidade', setor: 'Contabilidade', contato: 'Victoria', cargo: 'Contadora', cor: '#b388ff' },
    email: {
      assunto: 'Desafio: função para aplicar desconto',
      hora: 'Sex, 09:10',
      notaGerente: 'Último desafio: funções! Uma função guarda um trecho de código com nome para ser usado quando precisar.',
      paragrafos: [
        'Oi, é a Victoria de novo!',
        'Os clientes do escritório ganham 20 de desconto na mensalidade quando pagam à vista. Em vez de repetir essa conta toda vez, quero uma função que aplique o desconto a qualquer valor.',
        'Quero testar com uma mensalidade de 150: se o valor final ficar abaixo de 140, o sistema deve avisar que o desconto foi aplicado.'
      ],
      pedidos: [
        'Criar uma função que recebe um valor e devolve o valor menos 20',
        'Usar a função com o valor 150 e guardar o resultado',
        'Se o resultado for menor que 140, mostrar "Desconto aplicado"'
      ],
      assinatura: 'Victoria · Saldo Certo Contabilidade'
    },
    arquivo: 'desconto.py',
    saida: 'Desconto aplicado',
    agradecimento: 'Agora é só chamar a função para qualquer mensalidade. Obrigada!',
    aprendizado: 'Uma função (def) guarda um trecho de código com nome para ser reutilizado. O return devolve o resultado, e a chamada com_desconto(150) o usa em qualquer lugar.',
    linhas: [
      {
        indent: 0,
        blocos: [CTRL('def'), FUN('com_desconto('), VAR('valor'), PON(')'), PON(':')],
        distratores: [CTRL('for'), FUN('print(')],
        dica: 'Defina a função: def (roxa), o nome da função com o parêntese aberto, o parâmetro valor, o parêntese fechado e os dois-pontos. O parâmetro é o valor que a função recebe.'
      },
      {
        indent: 1,
        blocos: [CTRL('return'), VAR('valor'), OP('-'), VAL('20')],
        distratores: [OP('+'), VAL('150')],
        dica: 'Dentro da função (recuada), devolva o resultado com return: o valor menos 20.'
      },
      {
        indent: 0,
        blocos: [VAR('total'), OP('='), FUN('com_desconto('), VAL('150'), PON(')')],
        distratores: [FUN('desconto('), VAL('20')],
        dica: 'Fora da função (sem recuo), use a função: total recebe o resultado de com_desconto(150), com o valor 150 dentro dos parênteses.'
      },
      {
        indent: 0,
        blocos: [CTRL('if'), VAR('total'), OP('<'), VAL('140'), PON(':')],
        distratores: [OP('>'), VAL('130')],
        dica: 'Pergunte se o total ficou abaixo de 140: if, total, o operador <, o número 140 e os dois-pontos.'
      },
      {
        indent: 1,
        blocos: [FUN('print('), VAL('"Desconto aplicado"'), PON(')')],
        distratores: [VAL('"Sem desconto"')],
        dica: 'Só roda se a condição for verdadeira (recuada): mostre a frase do desconto.'
      }
    ]
  }
];

export const NIVEIS = [...NIVEIS_NORMAIS, ...NIVEIS_HARD];
export const TOTAL_NORMAIS = NIVEIS_NORMAIS.length;

export function linhaParaCodigo(linha) {
  let texto = '';
  linha.blocos.forEach((b, i) => {
    const colaComAnterior = b.texto === ')' || b.texto === ':' || b.texto === ',';
    const anteriorAbreParenteses = i > 0 && linha.blocos[i - 1].texto.endsWith('(');
    if (i > 0 && !colaComAnterior && !anteriorAbreParenteses) texto += ' ';
    texto += b.texto;
  });
  return '    '.repeat(linha.indent) + texto;
}
