/**
 * Interface do quiz: exibe uma pergunta por vez, dá o feedback de cada resposta
 * e mostra o resultado final. Quem usa decide o que fazer com a nota via `aoConcluir`.
 */
class TelaQuiz {
  constructor(quiz, raiz, { aoConcluir = () => {} } = {}) {
    this.quiz = quiz;
    this.aoConcluir = aoConcluir;

    const elemento = (id) => raiz.querySelector(`#${id}`);
    this.el = {
      formulario: elemento('quiz'),
      progresso: elemento('quiz-progresso'),
      enunciado: elemento('quiz-enunciado'),
      opcoes: elemento('quiz-opcoes'),
      feedback: elemento('quiz-feedback'),
      confirmar: elemento('quiz-confirmar'),
      proxima: elemento('quiz-proxima'),
      resultado: elemento('resultado'),
      nota: elemento('resultado-nota'),
      mensagem: elemento('resultado-mensagem'),
      avancar: elemento('resultado-avancar'),
      reiniciar: elemento('resultado-reiniciar'),
    };

    this.el.formulario.addEventListener('change', () => {
      this.el.confirmar.disabled = false;
    });
    this.el.formulario.addEventListener('submit', (evento) => {
      evento.preventDefault();
      this.confirmarResposta();
    });
    this.el.proxima.addEventListener('click', () => this.irParaProxima());
  }

  iniciar() {
    this.quiz.reiniciar();
    this.el.formulario.hidden = false;
    this.el.resultado.hidden = true;
    this.exibirPergunta();
  }

  exibirPergunta() {
    const { enunciado, opcoes } = this.quiz.perguntaAtual;

    this.el.progresso.textContent = `Pergunta ${this.quiz.numeroAtual} de ${this.quiz.total}`;
    this.el.enunciado.textContent = enunciado;
    this.el.opcoes.replaceChildren(...opcoes.map((texto, indice) => this.criarOpcao(texto, indice)));
    this.exibirFeedback('');

    this.el.confirmar.hidden = false;
    this.el.confirmar.disabled = true;
    this.el.proxima.hidden = true;
  }

  criarOpcao(texto, indice) {
    const rotulo = document.createElement('label');
    rotulo.className = 'quiz__opcao';

    const entrada = document.createElement('input');
    entrada.type = 'radio';
    entrada.name = 'resposta';
    entrada.value = indice;

    const descricao = document.createElement('span');
    descricao.textContent = texto;

    rotulo.append(entrada, descricao);
    return rotulo;
  }

  confirmarResposta() {
    const marcada = this.el.formulario.querySelector('input[name="resposta"]:checked');
    if (!marcada) return;

    const escolhida = Number(marcada.value);
    const acertou = this.quiz.responder(escolhida);

    this.destacarEscolhida(escolhida, acertou);
    this.exibirFeedback(acertou ? 'Você acertou!' : 'Você errou.', acertou);

    this.el.confirmar.hidden = true;
    this.el.proxima.textContent = this.quiz.ehUltimaPergunta ? 'Ver resultado' : 'Próxima pergunta';
    this.el.proxima.hidden = false;
    this.el.proxima.focus();
  }

  // Destaca só a opção marcada, sem revelar a correta: o aluno pode reiniciar e tentar de novo.
  destacarEscolhida(escolhida, acertou) {
    this.el.opcoes.querySelectorAll('.quiz__opcao').forEach((rotulo, indice) => {
      rotulo.querySelector('input').disabled = true;
      if (indice === escolhida) {
        rotulo.classList.add(acertou ? 'quiz__opcao--correta' : 'quiz__opcao--errada');
      }
    });
  }

  exibirFeedback(texto, acertou) {
    this.el.feedback.textContent = texto;
    this.el.feedback.classList.toggle('quiz__feedback--acerto', acertou === true);
    this.el.feedback.classList.toggle('quiz__feedback--erro', acertou === false);
  }

  irParaProxima() {
    this.quiz.avancar();
    if (this.quiz.terminou) {
      this.exibirResultado();
    } else {
      this.exibirPergunta();
    }
  }

  exibirResultado() {
    const { nota, aprovado, notaMinima } = this.quiz;

    this.el.formulario.hidden = true;
    this.el.resultado.hidden = false;
    this.el.nota.textContent = `Sua nota: ${nota}%`;
    this.el.mensagem.textContent = aprovado
      ? 'Você foi aprovado! Avance para concluir o curso.'
      : `Você não atingiu a nota mínima de ${notaMinima}%. Reinicie o curso para tentar novamente.`;
    this.el.avancar.hidden = !aprovado;
    this.el.reiniciar.hidden = aprovado;

    this.el.nota.setAttribute('tabindex', '-1');
    this.el.nota.focus();

    this.aoConcluir(this.quiz);
  }
}
