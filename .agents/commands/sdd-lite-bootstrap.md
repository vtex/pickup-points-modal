# SDD Lite Bootstrap — pickup-points-modal

Use this command for **hotfixes** on `fix/*` or `chk-*` branches where Full SDD would be excessive overhead.

## When Lite is allowed

- Bug fixes with a clear, contained scope (no public API change).
- Branch name starts with `fix/` or `chk-`.
- Change touches fewer than 3 files in `react/components/` or `react/utils/`.
- No changes to `manifest.json`, root components, or CI.

For everything else, use the Full SDD flow (`sdd-full-bootstrap.md`).

## Pipeline

```
/specification  → creates a lightweight spec.md (Business Context + Technical Contract)
/implementing   → implements from the approved spec up to the PR
```

## Before starting

1. Read `AGENTS.md` — verified commands, autonomy limits, sources of truth.
2. Confirm the bug is reproducible and the fix scope is clear.
3. Run `yarn install` from repo root.

## Verified commands

```bash
yarn lint          # ESLint over js,jsx,ts,tsx
yarn lint:ts       # tsc --noEmit
yarn lint:locales  # intl-equalizer (i18n key parity)
yarn test          # Jest on react/
yarn test:coverage # Jest with coverage report
```

## Files that require human approval even on hotfix branches

- `manifest.json` — version bump.
- `react/PickupPointsModal.js` — public API surface.
- `react/ModalState.js` — root state manager.
- `.travis.yml`, `.github/**` — CI/CD.

## Quality gates before opening PR

- [ ] `yarn lint` passes (0 errors).
- [ ] `yarn lint:ts` passes (0 type errors).
- [ ] `yarn test` passes (all tests green).
- [ ] Reproducing test added (failing before fix, green after).
