/**
 * Traduz os eventos do curso para o modelo de dados do SCORM 1.2.
 */
class Rastreamento {
  constructor(api) {
    this.api = api;
  }

  iniciar() {
    if (!this.api.iniciar()) return;

    // Só marca "incomplete" no primeiro acesso, para não apagar um resultado anterior.
    const status = this.api.obter('cmi.core.lesson_status');
    if (status === '' || status === 'not attempted') {
      this.api.definir('cmi.core.lesson_status', 'incomplete');
      this.api.salvar();
    }
  }

  registrarResultado(nota, aprovado) {
    this.api.definir('cmi.core.score.min', 0);
    this.api.definir('cmi.core.score.max', 100);
    this.api.definir('cmi.core.score.raw', nota);
    this.api.definir('cmi.core.lesson_status', aprovado ? 'passed' : 'failed');
    this.api.salvar();
  }

  encerrar() {
    this.api.finalizar();
  }
}
