/**
 * Ponto de entrada: monta os módulos do curso e liga os eventos da página.
 */
(() => {
  const NOTA_MINIMA = 60;

  const navegacao = new Navegacao([...document.querySelectorAll('.tela')]);
  const telaQuiz = new TelaQuiz(new Quiz(PERGUNTAS, NOTA_MINIMA), document.querySelector('#tela-quiz'));

  document.addEventListener('click', (evento) => {
    const botao = evento.target.closest('[data-acao]');
    if (botao?.dataset.acao === 'avancar') navegacao.avancar();
  });

  telaQuiz.iniciar();
})();
