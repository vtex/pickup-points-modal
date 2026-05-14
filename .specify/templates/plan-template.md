# Plan: <feature-name>

**Spec:** [./spec.md](./spec.md) | **Status:** Draft

## Files to touch

| Path | Type | Reason |
|---|---|---|
| `react/components/Foo.js` | write | <motivo> |
| `react/utils/bar.ts` | new | <motivo> |
| `messages/pt.json` | write | <chaves novas> |

## Order of operations

1. <Primeiro passo, geralmente o que destrava o resto>
2. <Segundo passo>
3. ...

## Test strategy

- **Unit:** <onde, o quê>
- **Integration:** <onde, o quê — usar fixtures em `react/__mocks__/`>
- **Manual QA:** <cenários no `yarn start`>

## i18n plan

- Locales tocados: <lista>
- Chaves novas: <lista>
- Fallback strategy: <inglês como default se tradução faltar?>

## Risks

| Risco | Mitigação |
|---|---|
| Backward-compat em `PickupPointsModal` props | <mitigação> |
| Performance regression no open do modal | <profiling antes/depois> |
| Locale faltando após merge | `yarn lint:locales` no CI |

## Constitution checks

- [ ] Princípio 1 (backward-compat) — <ok ou major bump documentado>
- [ ] Princípio 2 (tested behavior) — <cada mudança tem teste>
- [ ] Princípio 3 (i18n) — <chaves em todos locales>
- [ ] Princípio 4 (performance) — <sem regressão de bundle>
- [ ] Princípio 5 (side-effect free utils) — <utils puros>

## Out of scope
- <O que esse plan NÃO faz>
