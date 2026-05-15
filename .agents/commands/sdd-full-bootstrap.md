# SDD Full Bootstrap — pickup-points-modal

Use this command when starting a **new feature** on this repo that requires the Full SDD flow.

## When to use Full SDD

- Any new user-facing feature or behavioral change in `react/`.
- Changes to the public component API (`PickupPointsModal.js` props, events, `orderForm` shape).
- Changes that touch `manifest.json`, `package.json`, or CI pipelines.
- All work on `main`-targeted branches (not hotfix branches).

**Lite-only is allowed** for hotfixes on `fix/*` or `chk-*` branches. See `sdd-lite-bootstrap.md`.

## Pipeline

```
/speckit-specify   → generates specs/<feature>/spec.md
/speckit-plan      → generates specs/<feature>/plan.md
/speckit-tasks     → generates specs/<feature>/tasks.md
/speckit-implement → executes tasks in code
/speckit-analyze   → audits consistency between spec/plan/tasks/code
```

Or use the higher-level skill aliases:

```
/specification  → Business Context + Arch Decisions + Technical Contract (spec.md)
/implementing   → Implement from an approved spec up to the PR
```

## Before starting

1. Read `AGENTS.md` — verified commands, autonomy limits, sources of truth.
2. Read `.specify/memory/constitution.md` — binding principles.
3. Confirm the Jira/GitHub issue exists and acceptance criteria are clear.
4. Run `yarn install` from repo root.

## Verified commands

```bash
yarn lint          # ESLint over js,jsx,ts,tsx
yarn lint:ts       # tsc --noEmit
yarn lint:locales  # intl-equalizer (i18n key parity)
yarn test          # Jest on react/
yarn test:coverage # Jest with coverage report
yarn build         # Production build (lib/ + locales)
```

## Files that require human approval before touching

- `manifest.json` — version, dependencies, builders.
- `package.json` — dependencies, scripts, engines.
- `react/PickupPointsModal.js` — root component (public API).
- `react/ModalState.js` — root state manager.
- `.travis.yml`, `.github/**`, `.vtex/deployment.yaml` — CI/CD.
- `CHANGELOG.md` bumps and `vtex publish` / `npm publish`.

## Quality gates before opening PR

- [ ] `yarn lint` passes (0 errors).
- [ ] `yarn lint:ts` passes (0 type errors).
- [ ] `yarn lint:locales` passes (all locale files in sync).
- [ ] `yarn test` passes (all existing tests green).
- [ ] New behavior covered by at least one Jest test.
- [ ] `spec.md` approved before implementation starts.
