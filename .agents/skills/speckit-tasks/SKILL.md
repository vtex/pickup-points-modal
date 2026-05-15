---
name: speckit-tasks
description: Break an approved plan.md into a tasks.md list of small, sequenced, individually verifiable tasks for the pickup-points-modal feature implementation.
type: skill
---

# speckit-tasks

Turns an approved `plan.md` into a `tasks.md` of one-at-a-time
executable items. It is the direct prerequisite for `speckit-implement`.

## When to use

- `specs/<slug>/plan.md` approved.
- Ready to start coding.

## Flow

1. Read `specs/<slug>/plan.md`.
2. Fill `specs/<slug>/tasks.md` with tasks that are:
   - **Atomic:** one task = one concept changing (not "implement
     everything").
   - **Verifiable:** done when test X passes or behavior Y is
     observable.
   - **Ordered:** explicit dependencies (T2 depends on T1).
3. Each task has: ID, title, files, done criteria, associated test.

## Ideal size

- 3–8 tasks for a small feature.
- 8–15 tasks for a medium feature.
- More than that, **break it into sub-features** — the plan is
  probably too large.

## Template

See [.specify/templates/tasks-template.md](../../../.specify/templates/tasks-template.md).

## Don't

- Don't create an "implement everything" task.
- Don't create a task without acceptance criteria.
- Don't skip writing a test for a behavioral-change task (Principle 2).
