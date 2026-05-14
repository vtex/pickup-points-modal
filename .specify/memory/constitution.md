# Pickup Points Modal — Project Constitution

**Version** 1.0.0 | **Ratified** 2026-05-14 | **Last Amended** 2026-05-14

This constitution defines the **binding** principles that govern technical
and product decisions for `vtex.pickup-points-modal`. In case of conflict
with any other source (README, CONTRIBUTING, external docs), this
constitution prevails. Changes require a PR approved by 2 maintainers and
a version bump in the **Governance** section below.

## Principles

### 1. Backward-compatible public API

The contract exposed in [PickupPointsModal.js](../../react/PickupPointsModal.js)
is consumed by production workspaces across hundreds of VTEX stores. Any
change to props, events, or the shape of `orderForm`/`logisticsInfo`
required by the component is **breaking** and demands a major bump in
`manifest.json`.

- **Why:** VTEX IO apps receive this package via `1.x`/`3.x` dependency
  ranges; silently breaking the contract takes down checkout in
  production stores.
- **How to apply:** any PR touching `PickupPointsModal.js` requires a
  dedicated review focused on the public contract plus an explicit
  CHANGELOG entry.

### 2. Tested behavior over coverage number

Every new piece of logic requires Jest tests covering:

- The expected case (golden path)
- At least one error / edge case
- No visible regression: tests for the feature being modified continue
  to pass

There is no absolute coverage target — what matters is that every
behavioral change is anchored to a test.

- **Why:** the codebase mixes legacy JS and TS, and VTEX's `orderForm`
  has a shape with many optional fields. Coverage-by-number lies — bugs
  show up in combinations that were not in the plan.
- **How to apply:** PRs with behavioral changes but no new test go back
  to the author. Bugs detected in production must be reproduced with a
  test **before** the fix.

### 3. Internationalization is non-negotiable

Every user-facing string goes through `react-intl`. New keys must be
added to **all** locales present in `messages/` in the same PR — even if
the value is the original English string as a temporary fallback.

- **Why:** the component runs across BR/EN/ES/MX/PT stores in
  production; missing a key in one locale renders `Missing translation`
  visibly in checkout.
- **How to apply:** run `yarn lint:locales` before opening the PR.
  `intl-equalizer` must pass.

### 4. Performance budget on the checkout path

The modal opens in the critical purchase-completion flow. Changes must
not:

- Add network requests in the initial `componentDidMount`/`useEffect`
  without cache or debounce.
- Load heavy libraries (>50KB minified) into the main bundle — use
  dynamic import if strictly necessary.
- Break the lazy-load of Google Maps (currently loaded on demand).

- **Why:** checkout abandonment rises ~1% for every additional 100ms of
  TTI according to internal Checkout team analyses.
- **How to apply:** PRs that add a dependency must justify size in the
  description. Suspected performance regressions open a profiling task
  before merge.

### 5. Side-effect free utilities

Functions in `react/utils/` and `react/fetchers/` must be pure or
declare the side effect in the name (`fetchX`, `saveY`). No singletons,
no hidden global state.

- **Why:** makes it easy to unit-test without mounting the full
  component tree with providers.
- **How to apply:** PRs that add global state to a utility go back to
  the author with a suggestion to move it into `containers/` or
  `ModalState.js`.

## Governance

- **Ratified by:** repo maintainers + Checkout team tech lead.
- **How to propose a change:** PR editing this file, linked to a short
  RFC in the description. Minimum 2 approvals required.
- **Versioning:** follow SemVer in the `Version` field above. Patch for
  clarification, minor for a new principle, major for revoking or
  rewriting an existing principle.
- **Audit:** full constitution review every 6 months, or whenever a
  principle is violated in production (incident review).
- **Conflicts with AGENTS.md:** the constitution wins. AGENTS.md
  describes the "how"; the constitution describes the "why" and "what
  not to do".
