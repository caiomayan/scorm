/**
 * Wrapper da API SCORM 1.2.
 * Localiza o objeto `API` exposto pelo LMS e isola o restante do curso
 * das chamadas LMS*. Sem LMS, os métodos viram no-op e o curso segue funcionando.
 */
const ScormApi = (() => {
  const LIMITE_BUSCA = 10;

  let api = null;
  let conectado = false;

  function buscarNaHierarquia(janela) {
    let atual = janela;
    try {
      for (let nivel = 0; atual && nivel < LIMITE_BUSCA; nivel++) {
        if (atual.API) return atual.API;
        if (atual.parent === atual) break;
        atual = atual.parent;
      }
    } catch {
      // Janela de outra origem: o navegador bloqueia o acesso.
    }
    return null;
  }

  function localizarApi() {
    return buscarNaHierarquia(window) || (window.opener && buscarNaHierarquia(window.opener));
  }

  function iniciar() {
    if (conectado) return true;

    api = localizarApi();
    if (!api) {
      console.warn('SCORM: API do LMS não encontrada. Rodando sem rastreamento.');
      return false;
    }

    conectado = api.LMSInitialize('') === 'true';
    return conectado;
  }

  function obter(elemento) {
    return conectado ? api.LMSGetValue(elemento) : '';
  }

  function definir(elemento, valor) {
    return conectado && api.LMSSetValue(elemento, String(valor)) === 'true';
  }

  function salvar() {
    return conectado && api.LMSCommit('') === 'true';
  }

  function finalizar() {
    if (!conectado) return false;
    conectado = false;
    return api.LMSFinish('') === 'true';
  }

  return { iniciar, obter, definir, salvar, finalizar };
})();
