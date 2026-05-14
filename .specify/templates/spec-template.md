# Spec: <feature-name>

**Status:** Draft | **Author:** <name> | **Created:** YYYY-MM-DD
**Ticket:** <Jira/issue link or TBD>

## Business Context

### Problem
<What hurts the end user / team? Why now?>

### Stakeholders
- **Requested by:** <PM/customer/team>
- **Impacted users:** <who uses the feature>
- **Reviewers:** <who needs to approve>

### Success metrics
- <Observable metric post-release — e.g. "modal opens in <300ms p95">

## Architectural Decisions

### Components affected
<List files/modules. Mark each as `read`, `write`, or `new`.>

### Alternatives considered
| Option | Why it was dropped |
|---|---|
| <A> | <reason> |
| <B> | <reason> |

### Backward-compatibility risk
<Does the change break the public contract of `PickupPointsModal`?
If yes: justify a major bump. Cite Principle 1 of the constitution.>

## Technical Contract

### Props/Events changes
<List of changes to `PickupPointsModal` or exposed containers.>

### Fixtures / mocks
<Which fixtures under `react/__mocks__/` need updating?>

### i18n
- Locales touched: <pt-BR, en-US, ...>
- New keys: `<key1>`, `<key2>`

### Test plan
- **Golden path:** <scenario>
- **Edge cases:**
  - <case 1>
  - <case 2>

### Acceptance criteria
- [ ] <Verifiable criterion 1>
- [ ] <Verifiable criterion 2>

## Out of scope
- <What this spec does NOT cover>

## Clarifications
<Append-only. `speckit-clarify` appends here.>
