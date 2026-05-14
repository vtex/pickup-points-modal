---
name: speckit-git-commit
description: Compose Conventional Commits messages and stage the right files for a pickup-points-modal change, respecting CHANGELOG and the constitution's backward-compat principle.
type: skill
---

# speckit-git-commit

Compose commit messages in the repo's Conventional Commits style.

## Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Accepted types

| Type | When to use |
|---|---|
| `feat` | User-visible feature |
| `fix` | Bug fix |
| `chore` | Tooling/deps without functional change |
| `docs` | Documentation change (README, CHANGELOG, AGENTS) |
| `refactor` | Refactor without functional change |
| `test` | Tests only |
| `perf` | Performance improvement |

### Suggested scopes

- `modal` — `PickupPointsModal.js`, `ModalState.js`
- `map` — Google Maps components
- `i18n` — `messages/`
- `fetchers` — `react/fetchers/`
- `tooling` — config files

## Rules tied to the constitution

- **Breaking change** in `PickupPointsModal` props/events:
  - Add `BREAKING CHANGE:` in the footer.
  - Major bump in `manifest.json` (ask first).
  - CHANGELOG entry.

- **i18n change:** scope `i18n` and list the locales touched in the body.

## Staging

- Always stage by specific path (`git add react/components/X.js`),
  **never** `git add -A` or `git add .` — those can pull in `.env*` or
  build artifacts.
- Confirm with `git status` before committing.

## Don't

- `--no-verify` to skip hooks.
- Subject in uppercase.
- Subject longer than 72 chars.
