/**
 * Traduz os eventos do curso para o modelo de dados do SCORM 1.2.
 */
class Rastreamento {
  constructor(api) {
    this.api = api;
  }

  iniciar() {
    this.inicioSessao = Date.now();
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
    this.api.definir('cmi.core.session_time', Rastreamento.formatarDuracao(Date.now() - this.inicioSessao));
    this.api.finalizar();
  }

  // Formato CMITimespan do SCORM 1.2: HHHH:MM:SS.
  static formatarDuracao(milissegundos) {
    const totalSegundos = Math.floor(milissegundos / 1000);
    const horas = Math.floor(totalSegundos / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    const segundos = totalSegundos % 60;
    const doisDigitos = (valor) => String(valor).padStart(2, '0');

    return `${String(horas).padStart(4, '0')}:${doisDigitos(minutos)}:${doisDigitos(segundos)}`;
  }
}
