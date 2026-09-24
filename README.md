# Mini-curso SCORM: Fundamentos de HTML, CSS e JavaScript

Curso curto no formato SCORM 1.2, pronto para importar no Moodle. O pacote é o arquivo `curso-scorm.zip`,
disponível na página de [Releases](https://github.com/caiomayan/scorm/releases).

## Como funcionam as telas

1. **Boas-vindas:** apresenta o curso. O botão **Avançar** leva ao quiz.
2. **Quiz:** 3 perguntas de múltipla escolha, uma por vez. A cada resposta, o curso informa se o aluno
   acertou ou errou. No fim aparece a nota:
   - **60% ou mais:** aprovado, e o aluno pode avançar para a conclusão.
   - **Abaixo de 60%:** reprovado, e o aluno pode reiniciar o curso e tentar de novo.
3. **Conclusão:** mensagem "Parabéns, você concluiu!" com a nota final.

O botão **Sair do curso** aparece ao final do quiz e na conclusão. O **Reiniciar curso** aparece na conclusão
e quando o aluno é reprovado.

## O que fica registrado no Moodle

- Situação do aluno: **aprovado** ou **reprovado**
- Nota do quiz
- Tempo gasto no curso

## Como testei

1. **No computador, sem Moodle:** a pasta `teste/` simula um LMS e mostra, ao lado do curso, tudo o que o
   curso envia. Para abrir, rode `python -m http.server 8000` na pasta do projeto e acesse
   <http://localhost:8000/teste/>.
2. **Em um LMS real:** importei o pacote no [SCORM Cloud](https://cloud.scorm.com), que é gratuito, e fiz o
   curso reprovando e depois aprovando. A situação, a nota e o tempo foram registrados corretamente nos dois casos.

## Extras

- Ilustração na tela de boas-vindas
- Botão de reiniciar o curso
- Botão de sair do curso
- Registro do tempo gasto

## Pastas

- `curso/`: o conteúdo do curso (é o que vai dentro do .zip)
- `teste/`: página de teste que simula o LMS
- `scripts/`: gera o .zip (`./scripts/empacotar.ps1` no PowerShell)
