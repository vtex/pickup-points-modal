---
name: specification
description: Generate an SDD (Spec Driven Development) document for a new feature in the pickup-points-modal, covering Business Context, Architectural Decisions, and Technical Contract before any code is written.
type: skill
---

# specification

Use this skill when the user asks to "create a spec", "write an SDD", or
references a file under `specs/`. The deliverable is a
`specs/<feature-slug>/spec.md` file with three mandatory sections.

## When to use

- New feature that touches the public contract of `PickupPointsModal`.
- Architectural change (new container, new state flow).
- Refactor with cross-cutting impact (i18n, fetchers, map).

**Do not use** for a one-off bug fix or a styling tweak — go straight to
`implementing` or `speckit-git-commit`.

## Deliverable structure

```markdown
# Spec: <feature>

## Business Context
- Problem being solved
- Stakeholders (who asked, who is impacted)
- Success metrics

## Architectural Decisions
- Components/files affected
- Alternatives considered + why they were dropped
- Backward-compatibility risk (cite Principle 1 of the constitution)

## Technical Contract
- Changes to props/events
- Changes to fixtures/mocks
- Test plan (golden path + edge cases)
- i18n plan (new keys, locales touched)
- Verifiable acceptance criteria
```

## Expected inputs

- Natural-language description of the feature.
- Link to a Jira/issue ticket if one exists.
- List of suspected files (if the user has already investigated).

## How to apply

1. Read [.specify/memory/constitution.md](../../../.specify/memory/constitution.md)
   to understand binding principles.
2. Read [AGENTS.md](../../../AGENTS.md) for autonomy limits.
3. Sketch the 3 sections with `TBD` markers where input is missing.
4. Present the draft to the user before creating the final file.
5. Do not implement anything — spec only.
