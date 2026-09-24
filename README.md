# Mini-curso SCORM: Fundamentos de HTML, CSS e JavaScript

Mini-curso em **SCORM 1.2**, feito com HTML, CSS e JavaScript puros, com 3 telas: boas-vindas, quiz e conclusão.
Ele registra no LMS o status (`passed`/`failed`), a nota do quiz e o tempo gasto.

## Estrutura

```
curso/                  conteúdo do pacote SCORM (é o que vai no .zip)
├── imsmanifest.xml     manifesto SCORM 1.2 (nota mínima 60)
├── index.html          as 3 telas
├── css/estilo.css      layout responsivo
├── img/camadas-web.svg ilustração da tela de boas-vindas
└── js/
    ├── scorm-api.js    wrapper da API SCORM 1.2 (encontra a API do LMS)
    ├── rastreamento.js traduz os eventos do curso para os campos cmi.*
    ├── perguntas.js    banco de perguntas
    ├── quiz.js         regras do quiz (acertos, nota, aprovação)
    ├── tela-quiz.js    interface do quiz
    ├── navegacao.js    troca de telas
    └── curso.js        ponto de entrada: monta os módulos e liga os eventos
teste/                  LMS simulado para testar localmente (fora do .zip)
scripts/empacotar.ps1   gera dist/curso-scorm.zip
```

Cada arquivo JS tem uma responsabilidade só. A regra do quiz (`quiz.js`) não conhece o DOM nem o LMS, e o
`Rastreamento` recebe a API por parâmetro. Assim, dá para testar cada parte isoladamente.

## Como funcionam as telas

1. **Boas-vindas:** apresenta o tema com uma ilustração e tem o botão **Avançar**.
2. **Quiz:** 3 perguntas de múltipla escolha, uma por vez. O aluno marca uma opção e clica em **Confirmar**.
   O curso informa na hora se ele acertou ou errou, destacando a opção marcada, e libera a próxima pergunta.
   A resposta correta não é revelada, para que uma nova tentativa depois de reiniciar continue valendo.
   No fim aparece a nota:
   - **60% ou mais:** aprovado, com o botão **Avançar** para a conclusão.
   - **Menos de 60%:** reprovado, com o botão **Reiniciar curso** para tentar de novo.
3. **Conclusão:** exibe "Parabéns, você concluiu!", a nota final e o botão **Reiniciar curso**.

O botão **Reiniciar curso** zera o quiz e volta para a tela 1. A nova tentativa sobrescreve a nota e o status no LMS.

## O que é registrado no LMS

| Momento           | Campo SCORM 1.2                          | Valor                          |
| ----------------- | ---------------------------------------- | ------------------------------ |
| Primeiro acesso   | `cmi.core.lesson_status`                 | `incomplete`                   |
| Fim do quiz       | `cmi.core.score.raw` (`min` 0, `max` 100) | nota de 0 a 100                |
| Fim do quiz       | `cmi.core.lesson_status`                 | `passed` (≥ 60) ou `failed`    |
| Ao fechar o curso | `cmi.core.session_time`                  | tempo da sessão (`HHHH:MM:SS`) |

No SCORM 1.2 o status é um campo único. Por isso não existe um `completed` separado: `passed` e `failed`
já indicam que o aluno chegou ao fim do curso.

Sem um LMS por perto (por exemplo, abrindo o `index.html` direto), o curso funciona normalmente e só
avisa no console que está rodando sem rastreamento.

## Gerar o pacote .zip

No PowerShell, na raiz do projeto:

```powershell
./scripts/empacotar.ps1
```

O script cria `dist/curso-scorm.zip` com o `imsmanifest.xml` na raiz. As entradas são gravadas com `/`
porque o `Compress-Archive` do Windows usa `\`, o que quebra a importação em LMS que rodam em Linux.

## Como testei localmente

### 1. LMS simulado (sem instalar nada)

A pasta `teste/` tem uma página que cria uma API SCORM 1.2 falsa e carrega o curso num iframe. Na lateral,
ela mostra os campos `cmi.*` e cada chamada que o curso faz (`LMSInitialize`, `LMSSetValue`, `LMSCommit`,
`LMSFinish`...).

O navegador bloqueia a comunicação entre iframes abertos via `file://`, então é preciso um servidor local.
Na raiz do projeto:

```bash
python -m http.server 8000
```

Depois abra <http://localhost:8000/teste/>. A extensão Live Server do VS Code também funciona.

Roteiro que usei:

- Ao abrir: `LMSInitialize` e `lesson_status = incomplete`.
- Quiz com 3 acertos: `score.raw = 100` e `lesson_status = passed`.
- Quiz com 2 acertos: nota 67, `passed`. Com 1 acerto: nota 33, `failed`. Com nenhum: nota 0, `failed`.
- Reprovar, clicar em **Reiniciar curso** e refazer: o quiz volta zerado e o novo resultado sobrescreve o anterior.
- Ao fechar ou recarregar a página: `session_time` e `LMSFinish`, chamado uma vez só.
- Layout conferido em largura de desktop e de celular (375 px).

### 2. Em um LMS real

- **SCORM Cloud** (<https://cloud.scorm.com>, conta gratuita), onde o pacote foi validado: *Library → Add Content →
  Import a SCORM package*, enviar o `curso-scorm.zip`, clicar em *Launch* e, depois de sair, conferir o
  *Registration*. O pacote importou sem erros. Numa primeira tentativa reprovada, o registro mostrou `failed`,
  a nota e o tempo. Depois de reiniciar e aprovar, o status mudou para `passed`.
- **Moodle:** *Adicionar uma atividade ou recurso → Pacote SCORM*, enviar o `.zip` e salvar. Depois de fazer
  o curso, os resultados aparecem em *Relatórios* da atividade e no *Livro de notas*.

## Extras implementados

- **Multimídia:** ilustração em SVG na tela de boas-vindas mostrando onde o HTML, o CSS e o JS atuam numa página.
- **Botão de reiniciar curso:** na conclusão e no resultado de reprovação.
- **Tracking adicional:** tempo gasto na sessão (`cmi.core.session_time`).
