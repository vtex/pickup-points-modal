# Tasks: <feature-name>

**Plan:** [./plan.md](./plan.md) | **Status:** Draft

> Each task is atomic, ordered, and verifiable. Principle 2 of the
> constitution: behavioral change requires a new test.

## T1 — <short title>

- **Files:** `react/components/X.js`
- **Depends on:** —
- **Done when:** `<criterion>` (e.g. the new `X.test.js` passes).
- **Test:** `yarn test X.test.js`

## T2 — <short title>

- **Files:** `react/utils/y.ts`, `react/components/X.js`
- **Depends on:** T1
- **Done when:** `<criterion>`
- **Test:** `yarn test y.test.ts`

## T3 — <short title>

- **Files:** `messages/pt.json`, `messages/en.json`, `messages/es.json`
- **Depends on:** T1
- **Done when:** `yarn lint:locales` passes.
- **Test:** `yarn lint:locales`

## TN — Final checks

- **Files:** —
- **Depends on:** all previous tasks
- **Done when:** `yarn lint`, `yarn lint:ts`, `yarn test`, `yarn build`
  all pass.
