---
name: speckit-clarify
description: Interactively clarify ambiguous requirements in a spec.md before planning — generates targeted questions for the requester to resolve TBDs in the pickup-points-modal feature spec.
type: skill
---

# speckit-clarify

Generates focused questions to unblock a spec with TBDs or ambiguities.
Runs between `speckit-specify` and `speckit-plan`.

## When to use

- `spec.md` has 2+ `TBD` markers in required fields.
- Vague acceptance criteria ("it should just work well").
- A stakeholder was not explicit about edge cases.

## Flow

1. Read `specs/<slug>/spec.md`.
2. Identify gaps in:
   - Business Context (who, why, metric)
   - Architectural Decisions (alternatives, risks)
   - Technical Contract (props, fixtures, i18n, acceptance)
3. Generate **at most 5 questions** per iteration, ordered by impact.
4. Wait for user replies.
5. Update `spec.md` with the answers — preserve history under a
   `## Clarifications` section at the end of the file.

## Good questions

- Specific: "Should the modal close when a pickup is chosen? Before or
  after the confirm step?"
- Actionable: the answer changes the plan.
- Unique: not already answered earlier in the spec.

## Bad questions

- "Anything else?"
- "What do you think?"
- Questions the agent could answer by reading the code.
