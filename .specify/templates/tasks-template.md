# Tasks: <feature-name>

**Plan:** [./plan.md](./plan.md) | **Status:** Draft

> Cada task é atômica, ordenada, e verificável. Princípio 2 da constitution:
> mudança de comportamento exige teste novo.

## T1 — <título curto>

- **Files:** `react/components/X.js`
- **Depends on:** —
- **Done when:** `<critério>` (ex.: novo teste `X.test.js` passa).
- **Test:** `yarn test X.test.js`

## T2 — <título curto>

- **Files:** `react/utils/y.ts`, `react/components/X.js`
- **Depends on:** T1
- **Done when:** `<critério>`
- **Test:** `yarn test y.test.ts`

## T3 — <título curto>

- **Files:** `messages/pt.json`, `messages/en.json`, `messages/es.json`
- **Depends on:** T1
- **Done when:** `yarn lint:locales` passa.
- **Test:** `yarn lint:locales`

## TN — Final checks

- **Files:** —
- **Depends on:** todas anteriores
- **Done when:** `yarn lint`, `yarn lint:ts`, `yarn test`, `yarn build` passam.
