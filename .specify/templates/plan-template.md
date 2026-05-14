# Plan: <feature-name>

**Spec:** [./spec.md](./spec.md) | **Status:** Draft

## Files to touch

| Path | Type | Reason |
|---|---|---|
| `react/components/Foo.js` | write | <reason> |
| `react/utils/bar.ts` | new | <reason> |
| `messages/pt.json` | write | <new keys> |

## Order of operations

1. <First step, usually the one that unblocks the rest>
2. <Second step>
3. ...

## Test strategy

- **Unit:** <where, what>
- **Integration:** <where, what — use fixtures under `react/__mocks__/`>
- **Manual QA:** <scenarios via `yarn start`>

## i18n plan

- Locales touched: <list>
- New keys: <list>
- Fallback strategy: <English as default if translation missing?>

## Risks

| Risk | Mitigation |
|---|---|
| Backward-compat on `PickupPointsModal` props | <mitigation> |
| Performance regression when modal opens | <profiling before/after> |
| Missing locale after merge | `yarn lint:locales` in CI |

## Constitution checks

- [ ] Principle 1 (backward-compat) — <ok or major bump documented>
- [ ] Principle 2 (tested behavior) — <each change has a test>
- [ ] Principle 3 (i18n) — <keys in every locale>
- [ ] Principle 4 (performance) — <no bundle regression>
- [ ] Principle 5 (side-effect free utils) — <utilities are pure>

## Out of scope
- <What this plan does NOT do>
