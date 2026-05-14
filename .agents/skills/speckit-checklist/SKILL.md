---
name: speckit-checklist
description: Generate a per-feature validation checklist (pre-merge gates, manual QA steps, rollback plan) for a pickup-points-modal feature, tailored to the spec and constitution principles.
type: skill
---

# speckit-checklist

Generates a validation checklist to drop into the PR description or
into `specs/<slug>/checklist.md`. Not generic — it is derived from the
spec and the constitution principles.

## When to use

- Before requesting human review.
- On features touching checkout-critical paths.

## Structure

```markdown
# Checklist — <feature>

## Pre-merge gates
- [ ] `yarn lint` passes
- [ ] `yarn lint:ts` passes
- [ ] `yarn test` passes
- [ ] `yarn lint:locales` passes (if i18n was touched)
- [ ] `yarn build` passes
- [ ] CHANGELOG updated if the change is user-visible

## Constitution checks
- [ ] Principle 1: public contract preserved or major bump
- [ ] Principle 2: tests cover golden path + edge case
- [ ] Principle 3: new keys present in every locale
- [ ] Principle 4: no bundle/TTI regression
- [ ] Principle 5: new utilities are pure

## Manual QA
- [ ] Scenario <X> tested in the demo (`yarn start`)
- [ ] Works with empty `searchAddress`
- [ ] Works with 0 pickup points returned
- [ ] Works in `pt-BR` and `en-US` locales

## Rollback plan
- Branch revertable? <yes/no>
- Data migration? <yes/no>
- Feature flag? <name>
```

## Template

See [.specify/templates/checklist-template.md](../../../.specify/templates/checklist-template.md).
