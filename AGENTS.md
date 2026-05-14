# AGENTS.md — pickup-points-modal

Canonical onboarding for AI agents and new engineers working in this
repository. This file is the **operational source of truth** — read it
before touching any file.

- **App:** `vtex.pickup-points-modal` (VTEX IO React component)
- **Stack:** React + TypeScript + legacy JavaScript, VTEX IO React builder, Jest
- **VTEX IO layout:** `react/` (no `node/`)
- **Lifecycle:** `stable` (production checkout component)

## Golden Path mode

- **Default flow:** `Full` (SDD Lite + SDD Full enabled)
- **Rationale:** critical checkout component — new features must go through
  spec + plan + tasks before any implementation work.
- **Lite-only is allowed** for hotfixes on `fix/*` or `chk-*` branches.

## Sources of truth

Order matters: items higher in the list override the ones below in case of
conflict.

- [.specify/memory/constitution.md](.specify/memory/constitution.md) — binding
  principles (testing, performance, i18n). The project constitution.
- [README.md](README.md) — public API and `PickupPointsModal` props.
- [CONTRIBUTING.md](CONTRIBUTING.md) — PR flow and changelog rules.
- [manifest.json](manifest.json) — published version and VTEX IO dependencies.
- [react/PickupPointsModal.js](react/PickupPointsModal.js) — root component.
- [VTEX IO docs](https://developers.vtex.com/docs/guides/vtex-io-documentation) —
  builders, runtime and publish flow.
- **Product artifacts (L3) — public repo:** this repository is public on
  GitHub; product vision / one-pager / PRDs live in VTEX's internal
  Confluence space (Checkout team). Access through
  `https://vtex.atlassian.net/wiki/spaces/CHK` (restricted) — any product
  decision must be linked in the PR description.

## Verified commands

All commands below have been verified as executable from the repo root.
**Always run `yarn install` before the first execution.**

- `yarn install` — install dependencies (root + `react/`).
- `yarn lint` — run ESLint over `js,jsx,ts,tsx`.
- `yarn lint-fix` — ESLint with `--fix`.
- `yarn lint:ts` — typecheck via `tsc --noEmit -p react/tsconfig.json`.
- `yarn lint:locales` — `intl-equalizer` over `messages/` (i18n).
- `yarn test` — Jest on the `react/` workspace.
- `yarn test:coverage` — Jest with coverage.
- `yarn test:watch` — Jest in watch mode.
- `yarn build` — production build (`lib/` + locales).
- `yarn start` — `nwb serve-react-demo` (local dev server).
- `yarn format` — Prettier over `**/*.{ts,tsx,js,jsx,json}`.

## Expected skills

Skills available under [.agents/skills/](.agents/skills/). The agent must
invoke the appropriate skill before starting feature work.

| Skill | When to use |
|---|---|
| `specification` | Create an SDD doc (Business Context + Arch + Technical Contract) before a new feature. |
| `implementing` | Implement an approved spec autonomously up to the PR. |
| `speckit-constitution` | Edit/create the project constitution. |
| `speckit-specify` | Generate a `spec.md` from a feature description. |
| `speckit-plan` | Break a spec into a technical plan (`plan.md`). |
| `speckit-tasks` | Break a plan into executable tasks (`tasks.md`). |
| `speckit-implement` | Execute the generated tasks in code. |
| `speckit-analyze` | Audit consistency between spec/plan/tasks/code. |
| `speckit-clarify` | Clarify ambiguous requirements before planning. |
| `speckit-checklist` | Generate per-feature validation checklist. |
| `speckit-git-feature` | Create a feature branch following the repo convention. |
| `speckit-git-commit` | Compose Conventional Commits + Changeset entries. |

## Autonomy limits

The agent **may** freely modify, without confirmation:

- Files under `react/components/`, `react/containers/`, `react/utils/`,
  `react/fetchers/`, `react/types/`.
- Tests under `react/**/__tests__/` and `react/**/*.test.{js,ts,tsx}`.
- Messages under `messages/` as long as `messages/context.json` stays in
  English and new keys are added across all locales.

The agent **must ask for confirmation** before:

- Changing `manifest.json` (especially `version`, `dependencies`, `builders`).
- Changing `package.json` (dependencies, scripts, engines).
- Changing `.vtex/deployment.yaml`, `.travis.yml`, `.github/`, or any
  CI/CD pipeline.
- Changing `react/PickupPointsModal.js` or `react/ModalState.js` (root
  components).
- Publishing/release: `vtex publish`, `npm publish`, or bumping
  `CHANGELOG.md`.

The agent **must never**:

- Run `vtex publish`, `npm publish`, or `git push --force` on `main`.
- Skip hooks (`--no-verify`) or disable SonarQube/lint to unblock a PR.
- Commit secrets, tokens, `.env*` files, or Google Maps keys.
- Mock the `orderForm` in integration tests — use the fixtures under
  `react/__mocks__/`.
