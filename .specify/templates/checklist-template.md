# Checklist: <feature-name>

**Spec:** [./spec.md](./spec.md)

## Pre-merge gates

- [ ] `yarn lint` passes
- [ ] `yarn lint:ts` passes
- [ ] `yarn test` passes
- [ ] `yarn lint:locales` passes (if i18n was touched)
- [ ] `yarn build` passes
- [ ] CHANGELOG.md updated (if the change is user-visible)

## Constitution checks

- [ ] Principle 1: `PickupPointsModal` public contract preserved (or
  major bump documented in `manifest.json`)
- [ ] Principle 2: every behavioral change has a new test
- [ ] Principle 3: new i18n keys present in every locale
- [ ] Principle 4: no new dependency > 50KB without dynamic import
- [ ] Principle 5: new utilities under `react/utils/` are pure

## Manual QA

- [ ] Demo (`yarn start`): golden-path scenario
- [ ] Demo: empty `searchAddress`
- [ ] Demo: 0 pickup points returned
- [ ] Demo: `pt-BR` locale
- [ ] Demo: `en-US` locale

## Rollback plan

- **Branch revertable?** <yes/no — depends on migration>
- **Data migration?** <yes/no>
- **Feature flag?** <name or "not applicable">
- **Rollback steps:**
  1. <step 1>
  2. <step 2>
