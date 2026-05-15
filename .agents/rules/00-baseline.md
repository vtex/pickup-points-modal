---
name: pickup-points-modal-baseline
description: Baseline rules every agent must follow when editing this repo.
applyTo: "**/*"
---

# Baseline Rules — pickup-points-modal

## Stack

- **App:** `vtex.pickup-points-modal` — VTEX IO React component for checkout.
- **Source:** `react/` (no `node/` builder). Legacy JS + TypeScript coexist.
- **Test runner:** Jest via `vtex-test-tools` (`yarn test` from repo root).
- **Linter:** ESLint with `eslint-config-vtex` (root) and `eslint-config-vtex-react` (`react/`).
- **Formatter:** Prettier with `@vtex/prettier-config`.
- **Type checker:** `tsc --noEmit -p react/tsconfig.json`.

## Verified commands (always run from repo root)

```bash
yarn install          # install all dependencies first
yarn lint             # ESLint — must pass before any PR
yarn lint:ts          # TypeScript check — must pass before any PR
yarn lint:locales     # i18n key parity check — must pass before any PR
yarn test             # Jest test suite — must pass before any PR
yarn test:coverage    # Jest with coverage
yarn format           # Prettier auto-fix
yarn build            # production build
```

## Autonomy limits

**May modify freely:**
- `react/components/`, `react/containers/`, `react/utils/`, `react/fetchers/`, `react/types/`
- Tests: `react/**/__tests__/`, `react/**/*.test.{js,ts,tsx}`
- Messages: `messages/` — add keys to ALL locale files in the same PR

**Must ask for human approval:**
- `manifest.json` (version, dependencies, builders)
- `package.json` (dependencies, scripts, engines)
- `.travis.yml`, `.github/**`, `.vtex/deployment.yaml` (CI/CD)
- `react/PickupPointsModal.js` or `react/ModalState.js` (root/public API)
- Any publish action: `vtex publish`, `npm publish`, `CHANGELOG.md` bump

**Must never:**
- Run `git push --force` on `main` or skip hooks with `--no-verify`
- Commit secrets, `.env*` files, or Google Maps keys
- Remove tests to unblock a build
- Mock `orderForm` in integration tests — use `react/__mocks__/` fixtures

## SDD flow

- **Default:** Full SDD for all features (see `.agents/commands/sdd-full-bootstrap.md`)
- **Lite-only:** hotfixes on `fix/*` or `chk-*` branches (see `.agents/commands/sdd-lite-bootstrap.md`)

## Sources of truth (priority order)

1. `.specify/memory/constitution.md` — binding principles
2. `README.md` — public API and props
3. `CONTRIBUTING.md` — PR flow and changelog rules
4. `manifest.json` — published version and VTEX IO dependencies
