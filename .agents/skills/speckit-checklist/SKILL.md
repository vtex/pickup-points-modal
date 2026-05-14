---
name: speckit-checklist
description: Generate a per-feature validation checklist (pre-merge gates, manual QA steps, rollback plan) for a pickup-points-modal feature, tailored to the spec and constitution principles.
type: skill
---

# speckit-checklist

Gera um checklist de validação para colocar no PR description ou em
`specs/<slug>/checklist.md`. Não é genérico — é derivado da spec e dos
princípios da constituição.

## Quando usar

- Antes de pedir review humano.
- Em features que tocam checkout-critical paths.

## Estrutura

```markdown
# Checklist — <feature>

## Pre-merge gates
- [ ] `yarn lint` passa
- [ ] `yarn lint:ts` passa
- [ ] `yarn test` passa
- [ ] `yarn lint:locales` passa (se mexeu em i18n)
- [ ] `yarn build` passa
- [ ] CHANGELOG atualizado se mudança visível

## Constitution checks
- [ ] Princípio 1: contrato público preservado ou major bump
- [ ] Princípio 2: testes cobrem golden path + edge case
- [ ] Princípio 3: chaves novas em todos os locales
- [ ] Princípio 4: sem regressão de bundle/TTI
- [ ] Princípio 5: utils novos são puros

## Manual QA
- [ ] Cenário <X> testado no demo (`yarn start`)
- [ ] Funciona com `searchAddress` vazio
- [ ] Funciona com 0 pickup points retornados
- [ ] Funciona em locale `pt-BR` e `en-US`

## Rollback plan
- Branch revertível? <sim/não>
- Migração de dados? <sim/não>
- Feature flag? <nome>
```

## Template

Veja [.specify/templates/checklist-template.md](../../../.specify/templates/checklist-template.md).
