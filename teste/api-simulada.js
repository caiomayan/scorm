/**
 * API SCORM 1.2 simulada para testar o curso fora de um LMS.
 * Guarda os dados em memória e mostra cada chamada no painel da página.
 */
(() => {
  const dados = {
    'cmi.core.student_name': 'Aluno, Teste',
    'cmi.core.lesson_status': 'not attempted',
  };

  const tabela = document.querySelector('#dados');
  const registro = document.querySelector('#registro');

  function registrar(chamada) {
    const item = document.createElement('li');
    item.textContent = chamada;
    registro.append(item);
    item.scrollIntoView({ block: 'nearest' });
  }

  function atualizarTabela() {
    const linhas = Object.entries(dados).map(([elemento, valor]) => {
      const linha = document.createElement('tr');
      const nome = document.createElement('th');
      const conteudo = document.createElement('td');
      nome.textContent = elemento;
      conteudo.textContent = valor;
      linha.append(nome, conteudo);
      return linha;
    });
    tabela.replaceChildren(...linhas);
  }

  function responder(chamada, retorno = 'true') {
    registrar(`${chamada} → "${retorno}"`);
    return retorno;
  }

  window.API = {
    LMSInitialize: () => responder('LMSInitialize()'),
    LMSFinish: () => responder('LMSFinish()'),
    LMSCommit: () => responder('LMSCommit()'),
    LMSGetValue: (elemento) => responder(`LMSGetValue("${elemento}")`, dados[elemento] ?? ''),
    LMSSetValue: (elemento, valor) => {
      dados[elemento] = valor;
      atualizarTabela();
      return responder(`LMSSetValue("${elemento}", "${valor}")`);
    },
    LMSGetLastError: () => '0',
    LMSGetErrorString: () => 'No error',
    LMSGetDiagnostic: () => '',
  };

  atualizarTabela();

  // O curso só é carregado depois que a API existe, para que ele a encontre ao iniciar.
  document.querySelector('#curso').src = '../curso/index.html';
})();
