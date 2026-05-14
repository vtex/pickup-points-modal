---
name: speckit-analyze
description: Audit consistency between spec.md, plan.md, tasks.md, and the actual code in the pickup-points-modal — flagging drift, missing tasks, or out-of-spec changes before PR review.
type: skill
---

# speckit-analyze

Auditoria leve antes de abrir o PR. Detecta drift entre os 4 artefatos:
spec → plan → tasks → código.

## Quando usar

- Depois de `speckit-implement` e antes do `gh pr create`.
- Quando o autor da spec é diferente do implementador.
- Antes de pedir review humano em feature grande.

## Checks

1. **Spec → Plan:** todo critério de aceite da spec aparece como
   item no plano?
2. **Plan → Tasks:** todo arquivo listado em "Files to touch" tem ao
   menos uma task?
3. **Tasks → Code:** todo arquivo modificado em `git diff` está em
   alguma task?
4. **Constitution check:** o diff respeita os 5 princípios?

## Output

Relatório em markdown listando:

- ✅ Items alinhados
- ⚠️ Drift (mudou no código mas não na task / spec)
- ❌ Faltando (criterio de aceite sem implementação)

Não corrige nada — só reporta. O usuário decide se atualiza spec/plan
ou se reverte o código.

## Importante

`speckit-analyze` é **read-only**. Nunca edita spec, plan, tasks ou
código. Se encontrar drift, retorna o relatório e para.
