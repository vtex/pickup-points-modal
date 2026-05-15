---
name: speckit-constitution
description: Create or amend the project constitution in .specify/memory/constitution.md, capturing binding principles, governance, and ratification metadata for the pickup-points-modal.
type: skill
---

# speckit-constitution

Use to create or edit `.specify/memory/constitution.md`. This file is the
**binding source of truth** — it overrides any other doc in case of
conflict.

## When to use

- First time creating the constitution.
- Adding a new principle (minor bump).
- Revoking or rewriting a principle (major bump).
- Updating governance rules.

## Required structure

```markdown
# <Project> — Project Constitution

**Version** X.Y.Z | **Ratified** YYYY-MM-DD | **Last Amended** YYYY-MM-DD

## Principles
### 1. <Principle name>
- Why: ...
- How to apply: ...

## Governance
- Who ratifies
- How to propose a change
- Versioning (SemVer)
- Audit cadence
```

## Rules

- **No placeholders.** No `[PROJECT_NAME]`, `[PRINCIPLE_1_NAME]`, etc.
  left in the final file.
- **Version line always present.** The review script (item 9) greps for
  `**Version** ... **Ratified**`.
- **Concrete principles.** Each one has real `Why` and `How to apply` —
  empty bullets will fail item 1b downstream.

## Template

See [.specify/templates/constitution-template.md](../../../.specify/templates/constitution-template.md).
