---
name: speckit-git-feature
description: Create a new git feature branch following the pickup-points-modal naming convention (feat/<slug>, fix/<slug>, chore/<slug>) from latest origin/main.
type: skill
---

# speckit-git-feature

Cria branch de feature seguindo a convenção do repo.

## Quando usar

- Início de qualquer trabalho não-trivial.
- Antes de `speckit-implement`.

## Convenção de naming

| Prefixo | Quando usar |
|---|---|
| `feat/<slug>` | Feature nova visível ao usuário |
| `fix/<slug>` | Bug fix |
| `chore/<slug>` | Tooling, docs, deps sem mudança funcional |
| `refactor/<slug>` | Refactor sem mudança funcional |
| `chk-<ticket>` | Ticket Jira da equipe Checkout (formato `chk-NNNN`) |

`<slug>` é kebab-case, descritivo, max 5 palavras.

## Fluxo

```sh
git fetch origin
git checkout -b feat/<slug> origin/main
```

## Validações

- Branch atual antes de criar: idealmente `main` ou `origin/main`.
- Working tree limpo: pendente? Stash ou commit antes.
- Existe branch com mesmo slug? Apontar e perguntar.

## Não fazer

- Não criar branch a partir de uma branch de outra feature ainda não
  mergeada.
- Não usar `master` (o repo usa `main`).
- Não force-push em branch que já tem PR aberto.
