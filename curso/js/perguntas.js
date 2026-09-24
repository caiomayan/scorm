/**
 * Banco de perguntas do quiz. `correta` é o índice da opção certa.
 */
const PERGUNTAS = [
  {
    enunciado: 'Qual linguagem define a estrutura e o conteúdo de uma página web?',
    opcoes: ['CSS', 'HTML', 'JavaScript', 'SQL'],
    correta: 1,
  },
  {
    enunciado: 'Qual propriedade CSS altera a cor do texto de um elemento?',
    opcoes: ['font-color', 'text-style', 'color', 'background'],
    correta: 2,
  },
  {
    enunciado: 'Em JavaScript, qual método retorna o primeiro elemento que corresponde a um seletor CSS?',
    opcoes: [
      'document.querySelector()',
      'document.getElementsByClassName()',
      'document.select()',
      'console.log()',
    ],
    correta: 0,
  },
];
