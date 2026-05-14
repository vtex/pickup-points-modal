---
name: specification
description: Generate an SDD (Spec Driven Development) document for a new feature in the pickup-points-modal, covering Business Context, Architectural Decisions, and Technical Contract before any code is written.
type: skill
---

# specification

Use esta skill quando o usuário pedir para "criar uma spec", "escrever um SDD",
ou referenciar um arquivo em `specs/`. O entregável é um arquivo
`specs/<feature-slug>/spec.md` com três seções obrigatórias.

## Quando usar

- Feature nova que toca o contrato público do `PickupPointsModal`.
- Mudança de arquitetura (novo container, novo fluxo de estado).
- Refactor com impacto cross-cutting (i18n, fetchers, mapa).

**Não use** para bug fix pontual ou tweak de estilo — vai direto para
`implementing` ou `speckit-git-commit`.

## Estrutura do entregável

```markdown
# Spec: <feature>

## Business Context
- Problema que estamos resolvendo
- Stakeholders (quem pediu, quem é impactado)
- Métricas de sucesso

## Architectural Decisions
- Componentes/arquivos afetados
- Alternativas consideradas + por que foram descartadas
- Riscos de backward-compatibility (referenciar Principle 1 da constitution)

## Technical Contract
- Mudanças em props/eventos
- Mudanças em fixtures/mocks
- Plano de testes (golden path + edge cases)
- Plano de i18n (chaves novas, locales tocados)
- Critérios de aceite verificáveis
```

## Inputs esperados

- Descrição em linguagem natural da feature.
- Link para ticket Jira/issue se existir.
- Lista de arquivos suspeitos (se o usuário já investigou).

## Como aplicar

1. Ler [.specify/memory/constitution.md](../../../.specify/memory/constitution.md)
   para entender princípios vinculantes.
2. Ler [AGENTS.md](../../../AGENTS.md) para limites de autonomia.
3. Esboçar as 3 seções com `TBD` onde faltar input.
4. Apresentar para o usuário antes de criar o arquivo final.
5. Não implementar nada — apenas spec.
