---
name: implementing
description: Implement an approved spec end-to-end in the pickup-points-modal repo — branch, code, tests, lint, typecheck, build, commit, and open a PR following Conventional Commits and the project constitution.
type: skill
---

# implementing

Use this skill when the user says "implement it", "implement this spec",
"implement specs/<feature>.md", or asks for autonomous execution from an
already-approved spec.

## Prerequisites

- `specs/<feature>/spec.md` exists and is approved by the user.
- Constitution has been read
  ([.specify/memory/constitution.md](../../../.specify/memory/constitution.md)).
- AGENTS.md has been read for autonomy limits.

If any of these is missing, **stop** and ask the user to run the
`specification` skill first.

## Flow

1. **Branch.** `git checkout -b feat/<feature-slug>` (use `fix/<slug>`
   for bug fixes, `chore/<slug>` for tooling).
2. **Break into tasks.** List 3–8 concrete tasks in TodoWrite.
3. **Implement task by task.**
   - For each task: edit files → run `yarn lint --fix` → run
     `yarn test` in the affected scope → mark task complete.
   - Never skip tests. Principle 2 of the constitution.
4. **Lint & types.** Run `yarn lint` and `yarn lint:ts` before
   committing.
5. **i18n.** If a visible string was added, run `yarn lint:locales`.
   Principle 3 of the constitution.
6. **Build.** `yarn build` must pass.
7. **Commit.** Use `speckit-git-commit` to format Conventional Commits.
8. **PR.** Open with `gh pr create`, linking the spec, principles
   affected, and manual test plan.

## Autonomy limits

See [AGENTS.md](../../../AGENTS.md). In short:

- **Do not touch** `manifest.json`, `package.json`, `.travis.yml`,
  `.github/`, `.vtex/deployment.yaml` without explicit confirmation.
- **Do not publish.** `vtex publish` and `npm publish` are manual.
- **Do not force-push** to a branch that already has an open PR.

## When to pause and report

Pause and report back to the user when:

- The build fails in a way that suggests a dependency range change.
- Typecheck flags an issue in code you did not touch.
- A product/UX decision is not covered by the spec.
