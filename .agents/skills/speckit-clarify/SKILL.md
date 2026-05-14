---
name: speckit-clarify
description: Interactively clarify ambiguous requirements in a spec.md before planning — generates targeted questions for the requester to resolve TBDs in the pickup-points-modal feature spec.
type: skill
---

# speckit-clarify

Gera perguntas focadas para destravar uma spec com TBDs ou ambiguidades.
Roda entre `speckit-specify` e `speckit-plan`.

## Quando usar

- `spec.md` tem 2+ `TBD` em campos obrigatórios.
- Critério de aceite vago ("deve funcionar bem").
- Stakeholder não foi explícito em edge cases.

## Fluxo

1. Ler `specs/<slug>/spec.md`.
2. Identificar lacunas em:
   - Business Context (quem, por quê, métrica)
   - Architectural Decisions (alternativas, riscos)
   - Technical Contract (props, fixtures, i18n, aceite)
3. Gerar **no máximo 5 perguntas** por iteração, em ordem de impacto.
4. Aguardar respostas do usuário.
5. Atualizar `spec.md` com as respostas — preservar o histórico em
   `## Clarifications` no fim do arquivo.

## Perguntas boas

- Específicas: "O modal deve fechar ao escolher um pickup? Antes ou
  depois do confirm?"
- Acionáveis: a resposta muda o plan.
- Únicas: não repete o que já está respondido na spec.

## Perguntas ruins

- "Tem mais alguma coisa?"
- "O que você acha?"
- Perguntas que o agente pode responder lendo o código.
