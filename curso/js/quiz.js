/**
 * Regras do quiz: ordem das perguntas, acertos e nota. Não conhece o DOM nem o LMS.
 */
class Quiz {
  constructor(perguntas, notaMinima) {
    this.perguntas = perguntas;
    this.notaMinima = notaMinima;
    this.reiniciar();
  }

  reiniciar() {
    this.indice = 0;
    this.acertos = 0;
  }

  get perguntaAtual() {
    return this.perguntas[this.indice];
  }

  get numeroAtual() {
    return this.indice + 1;
  }

  get total() {
    return this.perguntas.length;
  }

  get ehUltimaPergunta() {
    return this.numeroAtual === this.total;
  }

  get terminou() {
    return this.indice >= this.total;
  }

  get nota() {
    return Math.round((this.acertos / this.total) * 100);
  }

  get aprovado() {
    return this.nota >= this.notaMinima;
  }

  responder(opcaoEscolhida) {
    const acertou = opcaoEscolhida === this.perguntaAtual.correta;
    if (acertou) this.acertos++;
    return acertou;
  }

  avancar() {
    this.indice++;
  }
}
