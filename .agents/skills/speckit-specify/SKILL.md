---
name: speckit-specify
description: Generate a spec.md file under specs/<feature>/ describing a new pickup-points-modal feature in Business Context, Architectural Decisions, and Technical Contract sections.
type: skill
---

# speckit-specify

Use to turn a natural-language description into a structured `spec.md`.
It is the first step of the Full Golden Path (SDD).

## When to use

- New feature requested via Jira/Slack.
- The user says "spec this feature: ..." or "/speckit-specify ...".

## Flow

1. Create the `specs/<feature-slug>/` folder.
2. Run `.specify/scripts/bash/create-new-feature.sh <slug>` if available;
   otherwise create the folder manually.
3. Fill `spec.md` using the template at
   [.specify/templates/spec-template.md](../../../.specify/templates/spec-template.md).
4. Mark unresolved fields as `TBD` — do not invent answers.
5. Present the draft to the user before starting `speckit-plan`.

## Minimum inputs to avoid mass-TBD

- Who requested it (Jira/PM/stakeholder)?
- What user-facing problem are we solving?
- Which files/components are likely affected?

## Output

`specs/<slug>/spec.md` with the sections:
- Business Context
- Architectural Decisions
- Technical Contract (props, fixtures, i18n, tests, acceptance)

## Important

`/specs` is in `.gitignore` — it is a local-only directory. Do not
commit specs into this public repo. To archive, move them to the
internal Confluence space.
