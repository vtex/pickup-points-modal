# Spec: <feature-name>

**Status:** Draft | **Author:** <name> | **Created:** YYYY-MM-DD
**Ticket:** <Jira/issue link or TBD>

## Business Context

### Problem
<O que dói para o usuário final / time? Por que agora?>

### Stakeholders
- **Requested by:** <PM/customer/team>
- **Impacted users:** <quem usa o feature>
- **Reviewers:** <quem precisa aprovar>

### Success metrics
- <Métrica observável após release — ex: "modal abre em <300ms p95">

## Architectural Decisions

### Components affected
<Liste arquivos/módulos. Marque como `read`, `write`, ou `new`.>

### Alternatives considered
| Opção | Por que descartada |
|---|---|
| <A> | <razão> |
| <B> | <razão> |

### Backward-compatibility risk
<Mudança quebra contrato público do `PickupPointsModal`?
Se sim: justificar major bump. Citar Princípio 1 da constitution.>

## Technical Contract

### Props/Events changes
<Lista de mudanças em `PickupPointsModal` ou containers expostos.>

### Fixtures / mocks
<Quais fixtures em `react/__mocks__/` precisam ser atualizadas?>

### i18n
- Locales tocados: <pt-BR, en-US, ...>
- Chaves novas: `<key1>`, `<key2>`

### Test plan
- **Golden path:** <cenário>
- **Edge cases:**
  - <caso 1>
  - <caso 2>

### Acceptance criteria
- [ ] <Critério verificável 1>
- [ ] <Critério verificável 2>

## Out of scope
- <O que essa spec NÃO cobre>

## Clarifications
<Append-only. `speckit-clarify` adiciona aqui.>
