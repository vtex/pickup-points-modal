---
name: speckit-plan
description: Break an approved spec.md into a technical plan.md listing files to touch, execution order, risks, and test strategy for a pickup-points-modal feature.
type: skill
---

# speckit-plan

Use after `speckit-specify` has produced an approved `spec.md`. This
skill breaks the spec into an **executable technical plan**, without
implementing anything yet.

## When to use

- `specs/<slug>/spec.md` approved by the user.
- The feature touches more than one file/layer (otherwise you can jump
  straight to `speckit-tasks`).

## Flow

1. Read `specs/<slug>/spec.md`.
2. Read [.specify/memory/constitution.md](../../../.specify/memory/constitution.md)
   to check conflicts with binding principles.
3. Run `.specify/scripts/bash/setup-plan.sh <slug>` if available.
4. Fill `specs/<slug>/plan.md` using
   [.specify/templates/plan-template.md](../../../.specify/templates/plan-template.md).

## Expected output

`specs/<slug>/plan.md` covering:

- **Files to touch** (with rationale for each)
- **Order of operations** (what comes first and why)
- **Test strategy** (unit, integration, e2e if applicable)
- **i18n plan** (new keys, locales touched)
- **Risks** (backward-compat, performance, regression)
- **Out of scope** explicitly stated

## Constitution check

Before marking the plan as ready, validate:

- Principle 1 (backward-compat): does the change break the public
  contract? Document it.
- Principle 2 (tested behavior): does each behavioral change have a
  planned test?
- Principle 3 (i18n): is every new string listed?
- Principle 4 (performance): added a synchronous request or bundle bloat?
- Principle 5 (side-effect free): is the new utility pure?
