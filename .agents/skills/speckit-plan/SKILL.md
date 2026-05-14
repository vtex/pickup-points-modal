---
name: speckit-plan
description: Break an approved spec.md into a technical plan.md with arquivos a tocar, ordem de execução, riscos e estratégia de testes para a pickup-points-modal.
type: skill
---

# speckit-plan

Use depois que `speckit-specify` aprovou uma `spec.md`. Esta skill quebra a
spec em um **plano técnico executável** sem ainda implementar.

## Quando usar

- `specs/<slug>/spec.md` aprovado pelo usuário.
- Feature toca mais de um arquivo / camada (caso contrário pode pular
  para `speckit-tasks` direto).

## Fluxo

1. Ler `specs/<slug>/spec.md`.
2. Ler [.specify/memory/constitution.md](../../../.specify/memory/constitution.md)
   para checar conflito com princípios vinculantes.
3. Rodar `.specify/scripts/bash/setup-plan.sh <slug>` se existir.
4. Preencher `specs/<slug>/plan.md` usando
   [.specify/templates/plan-template.md](../../../.specify/templates/plan-template.md).

## Output esperado

`specs/<slug>/plan.md` cobrindo:

- **Files to touch** (com motivo de cada)
- **Order of operations** (o que faz primeiro, por quê)
- **Test strategy** (unit, integração, e2e se aplicável)
- **i18n plan** (chaves novas, locales tocados)
- **Risks** (backward-compat, performance, regressão)
- **Out of scope** explícito

## Constitution check

Antes de marcar o plano como pronto, valide:

- Princípio 1 (backward-compat): mudança quebra contrato público? Documentar.
- Princípio 2 (tested behavior): cada mudança de comportamento tem teste planejado?
- Princípio 3 (i18n): toda string nova listada?
- Princípio 4 (performance): adicionou request síncrono ou bundle?
- Princípio 5 (side-effect free): novo util é puro?
