---
name: speckit-git-commit
description: Compose Conventional Commits messages and stage the right files for a pickup-points-modal change, respecting CHANGELOG and the constitution's backward-compat principle.
type: skill
---

# speckit-git-commit

Compor commit messages no padrão Conventional Commits do repo.

## Formato

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types aceitos

| Type | Quando usar |
|---|---|
| `feat` | Feature visível ao usuário |
| `fix` | Bug fix |
| `chore` | Tooling/deps sem mudança funcional |
| `docs` | Mudança em docs (README, CHANGELOG, AGENTS) |
| `refactor` | Refactor sem mudança funcional |
| `test` | Apenas testes |
| `perf` | Mudança que melhora performance |

### Scope sugerido

- `modal` — `PickupPointsModal.js`, `ModalState.js`
- `map` — componentes que tocam Google Maps
- `i18n` — `messages/`
- `fetchers` — `react/fetchers/`
- `tooling` — config files

## Regras vinculadas à constituição

- **Breaking change** em `PickupPointsModal` props/eventos:
  - Adicionar `BREAKING CHANGE:` no footer.
  - Major bump em `manifest.json` (pedir confirmação primeiro).
  - Entrada no CHANGELOG.

- **Mudança i18n:** scope `i18n` e listar locales tocados no body.

## Staging

- Sempre staging por path específico (`git add react/components/X.js`),
  **nunca** `git add -A` ou `git add .` — pode incluir `.env*` ou
  artefatos do build.
- Confirmar com `git status` antes de commitar.

## Não fazer

- `--no-verify` para pular hooks.
- Commit message em maiúsculas no subject.
- Subject > 72 chars.
