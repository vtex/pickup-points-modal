---
name: speckit-specify
description: Generate a spec.md file under specs/<feature>/ describing a new pickup-points-modal feature in Business Context, Architectural Decisions, and Technical Contract sections.
type: skill
---

# speckit-specify

Use para transformar uma descrição em linguagem natural em uma `spec.md`
estruturada. É o primeiro passo do Golden Path Full (SDD).

## Quando usar

- Feature nova solicitada via Jira/Slack.
- Usuário diz "spec essa feature: ..." ou "/speckit-specify ...".

## Fluxo

1. Criar pasta `specs/<feature-slug>/`.
2. Rodar `.specify/scripts/bash/create-new-feature.sh <slug>` se existir,
   senão criar manualmente.
3. Preencher `spec.md` usando o template em
   [.specify/templates/spec-template.md](../../../.specify/templates/spec-template.md).
4. Marcar campos não esclarecidos como `TBD` — não inventar.
5. Apresentar para o usuário antes de iniciar `speckit-plan`.

## Inputs mínimos para não retornar TBD em massa

- Quem pediu (Jira/PM/stakeholder)?
- Qual problema do usuário final?
- Quais arquivos/componentes provavelmente afetados?

## Output

`specs/<slug>/spec.md` com seções:
- Business Context
- Architectural Decisions
- Technical Contract (props, fixtures, i18n, testes, aceite)

## Importante

`/specs` está no `.gitignore` — é diretório local. Não commite specs no
repo público. Para arquivar, mova para o Confluence interno.
