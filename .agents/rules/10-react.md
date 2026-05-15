---
name: pickup-points-modal-react
description: Rules scoped to the React source in react/ — component conventions, testing, i18n, and public API gate.
applyTo: "react/**/*"
---

# React Source Rules — pickup-points-modal

## Component conventions

- **Class components** are legacy — prefer functional components with hooks for new code.
- **PropTypes** are required on all new components alongside TypeScript types (dual-declaration pattern already used in the codebase).
- Container components live in `react/containers/`; pure UI in `react/components/`.
- Side effects and I/O belong in `react/fetchers/` or `react/containers/`, never inside utility functions in `react/utils/`.
- Utility functions must be pure (no I/O, no singletons). Name I/O functions explicitly: `fetchX`, `saveY`, or suffix with `Event` for telemetry (see `react/utils/metrics.js`).

## Testing expectations

- Test files live in `react/**/__tests__/` or next to source as `*.test.{js,ts,tsx}`.
- Every behavioral change must be accompanied by at least one Jest test covering the new behavior.
- Use `react/__mocks__/` fixtures for `orderForm` and VTEX IO module mocks — do not create new inline mocks for these.
- Snapshot tests (`.snap`) are in `react/components/__tests__/__snapshots__/` — update them intentionally, never blindly.

## Internationalization (non-negotiable)

- Every user-facing string must use `react-intl` (`<FormattedMessage>` or `intl.formatMessage`).
- New i18n keys must be added to **all** locale files in `messages/` in the same PR.
- `messages/context.json` is the English master — new keys go here first.
- Run `yarn lint:locales` before opening any PR that touches `messages/`.

## Public API gate

`react/PickupPointsModal.js` is the public contract consumed by production VTEX stores.

- Any prop addition, removal, or shape change is **breaking** and requires a major version bump in `manifest.json`.
- Changes to this file require human approval and an explicit `CHANGELOG.md` entry.
- The Google Maps gated load in `react/containers/withGoogleMaps.js` must not be bypassed.

## Performance rules

- No unconditional network requests on initial render without cache or debounce.
- No heavy library imports in the main bundle without justification in the PR description.
- PRs that increase bundle size must explain the cost and loading strategy.
