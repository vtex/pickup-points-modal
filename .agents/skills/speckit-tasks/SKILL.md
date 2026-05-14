---
name: speckit-tasks
description: Break an approved plan.md into a tasks.md list of small, sequenced, individually verifiable tasks for the pickup-points-modal feature implementation.
type: skill
---

# speckit-tasks

Transforma um `plan.md` aprovado em um `tasks.md` com itens executáveis
um-por-um. Pré-requisito imediato do `speckit-implement`.

## Quando usar

- `specs/<slug>/plan.md` aprovado.
- Pronto para começar a codar.

## Fluxo

1. Ler `specs/<slug>/plan.md`.
2. Preencher `specs/<slug>/tasks.md` com tasks do tipo:
   - **Atômica:** uma task = um conceito mudando (não "implementar tudo").
   - **Verificável:** termina quando teste X passa ou comportamento Y é
     observável.
   - **Ordenada:** dependências explícitas (T2 depende de T1).
3. Cada task tem: ID, título, arquivos, critério de feito, teste associado.

## Tamanho ideal

- 3–8 tasks por feature pequena.
- 8–15 tasks por feature média.
- Se passar disso, **quebre em sub-features** — provavelmente o plano
  está muito grande.

## Template

Veja [.specify/templates/tasks-template.md](../../../.specify/templates/tasks-template.md).

## Não fazer

- Não criar task "implementar tudo".
- Não criar task sem critério de aceite.
- Não pular escrita de teste em task de mudança de comportamento (princípio 2).
