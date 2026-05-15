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
is consumed by production workspaces of stores using VTEX Checkout. Any
change to props, events, or the shape of `orderForm`/`logisticsInfo`
required by the component is **breaking** and demands a major bump in
`manifest.json` (currently at `3.x`).

- **Why:** VTEX IO apps and the NPM package `@vtex/pickup-points-modal`
  receive this code via `1.x`/`3.x` dependency ranges; silently breaking
  the contract takes down checkout in production stores.
- **How to apply:** any PR touching `PickupPointsModal.js` requires a
  dedicated review focused on the public contract plus an explicit
  CHANGELOG entry.

### 2. Tested behavior, not coverage number

Behavioral changes require Jest tests that exercise the new behavior. The
project does not target a fixed coverage percentage — what matters is
that each shipped change has at least one test pinning the intended
behavior.

- **Why:** the codebase mixes legacy JS and TS, and VTEX's `orderForm`
  has many optional fields. Coverage-by-number is misleading — bugs show
  up in combinations that were not in the plan. Today's test suite is
  intentionally narrow (~11 test files); this principle keeps the bar
  on *new* behavior rather than retroactively asking for full coverage.
- **How to apply:** PRs that change behavior without adding or updating
  a test are pushed back to the author. Reproducing a production bug
  with a failing test before the fix is the strongly preferred default,
  not a hard gate.

### 3. Internationalization is non-negotiable

Every user-facing string goes through `react-intl`. New keys must be
added to **all** locale files present in `messages/` in the same PR —
even if the value is the original English string as a temporary
fallback. `messages/context.json` is the English master and the source
of truth for keys.

The component currently ships with 31 locale files in `messages/`
(plus `context.json` as the English master):

```
ar-SA  bg     ca     cs     da     de     el     en
en-GB  en-LB  en-MM  en-US  es     fi     fr     id-ID
it     ja     ko     nl     nn     no     pl     pt-BR
pt-PT  ro     ru     sk     sl     sv     uk
```

- **Why:** the component runs across all the locales above in
  production; missing a key in any one of them renders
  `Missing translation` visibly in checkout.
- **How to apply:** run `yarn lint:locales` (`intl-equalizer`) before
  opening the PR. It must pass.

### 4. Performance on the checkout-open path

The modal opens in the critical purchase-completion flow. Changes must
not:

- Add unconditional network requests on initial render
  (`componentDidMount`/`useEffect`) without cache or debounce.
- Pull heavy libraries into the main bundle when a dynamic import or a
  smaller alternative would do the job.
- Break the existing gated load of Google Maps in
  [`containers/withGoogleMaps.js`](../../react/containers/withGoogleMaps.js)
  (the map only initializes when `googleMapsKey` is provided, via
  `GoogleMapsContainer` from `vtex.address-form`).

- **Why:** performance regressions on this path are visible to every
  user who reaches the shipping step. There is no published numeric
  budget — judgment is required, and PRs that grow bundle size or add
  blocking work must justify the cost in the description.
- **How to apply:** PRs that add a dependency must explain the size and
  loading strategy in the description. Suspected regressions open a
  profiling task before merge.

### 5. Side-effect aware utilities

Functions under `react/utils/` should be pure. Functions that perform
I/O or telemetry must declare it in the name (`fetchX`, `saveY`, the
`...Event` suffix used in [`utils/metrics.js`](../../react/utils/metrics.js)).
Network calls live under `react/fetchers/`.

- **Why:** this makes it easy to unit-test utilities without mounting
  the full component tree with providers.
- **How to apply:** PRs that add global state to a utility (a singleton,
  a mutable module-level cache) go back to the author with a suggestion
  to move it into `containers/` or `ModalState.js`.
- **Known exception:** `react/fetchers/index.js` installs a global
  `axios-retry` interceptor at module load. Any new module-level
  mutation of shared singletons must be reviewed against this
  precedent and added here.

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
