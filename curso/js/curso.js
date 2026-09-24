/**
 * Ponto de entrada: monta os módulos do curso e liga os eventos da página.
 */
(() => {
  const navegacao = new Navegacao([...document.querySelectorAll('.tela')]);

  document.addEventListener('click', (evento) => {
    const botao = evento.target.closest('[data-acao]');
    if (botao?.dataset.acao === 'avancar') navegacao.avancar();
  });
})();
