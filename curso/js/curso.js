/**
 * Ponto de entrada: monta os módulos do curso e liga os eventos da página.
 */
(() => {
  const NOTA_MINIMA = 60;

  const rastreamento = new Rastreamento(ScormApi);
  const navegacao = new Navegacao([...document.querySelectorAll('.tela')]);
  const telaQuiz = new TelaQuiz(new Quiz(PERGUNTAS, NOTA_MINIMA), document.querySelector('#tela-quiz'), {
    aoConcluir: ({ nota, aprovado }) => {
      rastreamento.registrarResultado(nota, aprovado);
      document.querySelector('#conclusao-nota').textContent = `Sua nota final foi ${nota}%.`;
    },
  });

  const acoes = {
    avancar: () => navegacao.avancar(),
    reiniciar: () => {
      telaQuiz.iniciar();
      navegacao.voltarAoInicio();
    },
  };

  document.addEventListener('click', (evento) => {
    const acao = evento.target.closest('[data-acao]')?.dataset.acao;
    acoes[acao]?.();
  });

  // `pagehide` cobre navegadores modernos; `beforeunload` cobre LMS que fecham a janela do curso.
  window.addEventListener('pagehide', () => rastreamento.encerrar());
  window.addEventListener('beforeunload', () => rastreamento.encerrar());

  rastreamento.iniciar();
  telaQuiz.iniciar();
})();
