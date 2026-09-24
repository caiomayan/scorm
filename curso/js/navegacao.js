/**
 * Controla qual tela do curso está visível. A ordem segue a do HTML.
 */
class Navegacao {
  constructor(telas) {
    this.telas = telas;
    this.indiceAtual = 0;
  }

  mostrar(indice) {
    this.telas.forEach((tela, i) => {
      tela.hidden = i !== indice;
    });
    this.indiceAtual = indice;
    this.focarTitulo();
  }

  avancar() {
    if (this.indiceAtual < this.telas.length - 1) {
      this.mostrar(this.indiceAtual + 1);
    }
  }

  voltarAoInicio() {
    this.mostrar(0);
  }

  irPara(id) {
    this.mostrar(this.telas.findIndex((tela) => tela.id === id));
  }

  // Leva o foco (e o leitor de tela) para o início do novo conteúdo.
  focarTitulo() {
    const titulo = this.telas[this.indiceAtual].querySelector('h1');
    titulo.setAttribute('tabindex', '-1');
    titulo.focus();
  }
}
