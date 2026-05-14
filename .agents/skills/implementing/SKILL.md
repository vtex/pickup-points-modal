---
name: implementing
description: Implement an approved spec end-to-end in the pickup-points-modal repo — branch, code, tests, lint, typecheck, build, commit, and open a PR following Conventional Commits and the project constitution.
type: skill
---

# implementing

Use esta skill quando o usuário disser "implementa", "implementa essa spec",
"implementa specs/<feature>.md", ou pedir execução autônoma a partir de uma
spec já aprovada.

## Pré-requisitos

- `specs/<feature>/spec.md` existe, aprovado pelo usuário.
- Constituição lida ([.specify/memory/constitution.md](../../../.specify/memory/constitution.md)).
- AGENTS.md lido para limites de autonomia.

Se algum desses faltar, **pare** e peça para o usuário rodar a skill
`specification` primeiro.

## Fluxo

1. **Branch.** `git checkout -b feat/<feature-slug>` (use `fix/<slug>` para
   bug fix, `chore/<slug>` para tooling).
2. **Quebrar em tasks.** Liste 3–8 tasks concretas em TodoWrite.
3. **Implementar task-a-task.**
   - Para cada task: editar arquivos → rodar `yarn lint --fix` → rodar
     `yarn test` no escopo afetado → marcar task completa.
   - Nunca pule testes. Princípio 2 da constitution.
4. **Lint & types.** Rode `yarn lint` e `yarn lint:ts` antes de commitar.
5. **i18n.** Se adicionou string visível, rode `yarn lint:locales`.
   Princípio 3 da constitution.
6. **Build.** `yarn build` precisa passar.
7. **Commit.** Use `speckit-git-commit` para formatar Conventional Commits.
8. **PR.** Abra com `gh pr create` linkando a spec, princípios afetados,
   e plano de teste manual.

## Autonomy limits

Veja [AGENTS.md](../../../AGENTS.md). Em resumo:

- **Não tocar** `manifest.json`, `package.json`, `.travis.yml`,
  `.github/`, `.vtex/deployment.yaml` sem confirmação explícita.
- **Não publicar.** `vtex publish` e `npm publish` são manuais.
- **Não force-push** na branch que já tem PR aberto.

## Quando reportar de volta

Pause e reporte para o usuário quando:

- O build falhar de um jeito que sugere mudança em dep range.
- O typecheck encontrar problema em código que você não tocou.
- Uma decisão de produto/UX não estiver na spec.
