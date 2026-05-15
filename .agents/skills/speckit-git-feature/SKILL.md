---
name: speckit-git-feature
description: Create a new git feature branch following the pickup-points-modal naming convention (feat/<slug>, fix/<slug>, chore/<slug>) from latest origin/main.
type: skill
---

# speckit-git-feature

Creates a feature branch following the repo's naming convention.

## When to use

- At the start of any non-trivial work.
- Before `speckit-implement`.

## Naming convention

| Prefix | When to use |
|---|---|
| `feat/<slug>` | User-visible new feature |
| `fix/<slug>` | Bug fix |
| `chore/<slug>` | Tooling, docs, deps without functional change |
| `refactor/<slug>` | Refactor without functional change |
| `chk-<ticket>` | Checkout team Jira ticket (`chk-NNNN` format) |

`<slug>` is kebab-case, descriptive, max 5 words.

## Flow

```sh
git fetch origin
git checkout -b feat/<slug> origin/main
```

## Validations

- Current branch before creating: ideally `main` or `origin/main`.
- Working tree clean: anything pending? Stash or commit first.
- Branch with the same slug exists? Surface it and ask.

## Don't

- Don't create a branch off another feature branch that has not been
  merged yet.
- Don't use `master` (the repo uses `main`).
- Don't force-push to a branch that already has an open PR.
