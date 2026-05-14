# Checklist: <feature-name>

**Spec:** [./spec.md](./spec.md)

## Pre-merge gates

- [ ] `yarn lint` passa
- [ ] `yarn lint:ts` passa
- [ ] `yarn test` passa
- [ ] `yarn lint:locales` passa (se mexeu em i18n)
- [ ] `yarn build` passa
- [ ] CHANGELOG.md atualizado (se mudança visível)

## Constitution checks

- [ ] Princípio 1: contrato público de `PickupPointsModal` preservado
  (ou major bump documentado em `manifest.json`)
- [ ] Princípio 2: cada mudança de comportamento tem teste novo
- [ ] Princípio 3: chaves de i18n novas presentes em todos os locales
- [ ] Princípio 4: nenhuma nova lib > 50KB sem dynamic import
- [ ] Princípio 5: novos utils em `react/utils/` são puros

## Manual QA

- [ ] Demo (`yarn start`): cenário golden path
- [ ] Demo: `searchAddress` vazio
- [ ] Demo: 0 pickup points retornados
- [ ] Demo: locale `pt-BR`
- [ ] Demo: locale `en-US`

## Rollback plan

- **Branch revertível?** <sim/não — depende de migração>
- **Migração de dados?** <sim/não>
- **Feature flag?** <nome ou "não aplicável">
- **Rollback steps:**
  1. <passo 1>
  2. <passo 2>
