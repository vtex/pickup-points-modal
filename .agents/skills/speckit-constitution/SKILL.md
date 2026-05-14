---
name: speckit-constitution
description: Create or amend the project constitution in .specify/memory/constitution.md, capturing binding principles, governance, and ratification metadata for the pickup-points-modal.
type: skill
---

# speckit-constitution

Use para criar ou editar `.specify/memory/constitution.md`. Esse arquivo é a
**fonte de verdade vinculante** — sobrescreve qualquer outro doc em caso
de conflito.

## Quando usar

- Primeira vez criando a constituição.
- Adicionando um novo princípio (minor bump).
- Revogando ou reescrevendo um princípio (major bump).
- Atualizando regras de governança.

## Estrutura obrigatória

```markdown
# <Project> — Project Constitution

**Version** X.Y.Z | **Ratified** YYYY-MM-DD | **Last Amended** YYYY-MM-DD

## Principles
### 1. <Nome do princípio>
- Why: ...
- How to apply: ...

## Governance
- Quem ratifica
- Como propor mudança
- Versionamento (SemVer)
- Auditoria
```

## Regras

- **Sem placeholders.** Nada de `[PROJECT_NAME]`, `[PRINCIPLE_1_NAME]` etc.
  no arquivo final.
- **Version sempre presente.** O grep do review (item 9) procura por
  `**Version** ... **Ratified**`.
- **Princípios concretos.** Cada um tem `Why` e `How to apply` reais —
  bullets vazios falham o item 1b por extensão.

## Template

Veja [.specify/templates/constitution-template.md](../../../.specify/templates/constitution-template.md).
