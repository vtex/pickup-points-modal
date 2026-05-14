---
name: speckit-analyze
description: Audit consistency between spec.md, plan.md, tasks.md, and the actual code in the pickup-points-modal — flagging drift, missing tasks, or out-of-spec changes before PR review.
type: skill
---

# speckit-analyze

Lightweight audit before opening the PR. Detects drift across the four
artifacts: spec → plan → tasks → code.

## When to use

- After `speckit-implement` and before `gh pr create`.
- When the spec author is different from the implementer.
- Before requesting human review on a large feature.

## Checks

1. **Spec → Plan:** does every acceptance criterion from the spec
   appear as an item in the plan?
2. **Plan → Tasks:** does every file listed under "Files to touch"
   have at least one task?
3. **Tasks → Code:** is every file modified in `git diff` covered by
   some task?
4. **Constitution check:** does the diff respect the 5 principles?

## Output

A markdown report listing:

- ✅ Items in sync
- ⚠️ Drift (changed in code but not in the task/spec)
- ❌ Missing (acceptance criterion without implementation)

It does not fix anything — it only reports. The user decides whether to
update spec/plan or revert the code.

## Important

`speckit-analyze` is **read-only**. It never edits the spec, plan,
tasks or code. If drift is found, it returns the report and stops.
